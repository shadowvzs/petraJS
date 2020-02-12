import {
    IGlobal,
    KeyValuePair,
    IVDOM,
    IEvents
} from "./types";
import { concat, map, toArray, forEach, objFor, flat, objMerge } from "@util/performance";
import { classAutobind } from "@util/core";
import { events } from "./Events";
import { fPromise } from '@util/core';
import { toStyle } from "./JSS";

type IAttrs = IVDOM.Children['attrs'];
type IChilds = IVDOM.Children['children'];
type ITagName = string;

// used to rebuild the subtree (it is)
type IBuildCustomElem = (arg0: any) => IVDOM.Children;
type IBuildAttr = [IBuildCustomElem, IAttrs];
/*
export type StyleRules<ClassKey extends string = string> = Record<ClassKey, CSSProperties>
export interface CSSProperties extends CSS.Properties<number | string> {
    [k: string]: CSS.Properties<number | string>[keyof CSS.Properties] | CSSProperties;
}
*/


export class VDom implements IVDOM.Core {
    public $App: IGlobal.DOM;
    public $root: IGlobal.DOM;
    public App: IVDOM.Children;
    public hookMap: IVDOM.HookMap = {} as IVDOM.HookMap;
    public hookKey?: symbol = undefined;
    private $recycleBin: HTMLDivElement = document.createElement('div');
    private events: IEvents.Core = events;
    private lastPageData: [IVDOM.CallSignature[], KeyValuePair<string>];
    private _safeLoadQueue: (() => void)[] = [];
    private namespacedTags = {
        svg: 'http://www.w3.org/2000/svg',
        path: 'http://www.w3.org/2000/svg'
    }

    constructor(rootSelector = 'body') {
        this.$root = document.querySelector(rootSelector) as IGlobal.DOM;
        classAutobind(this);
        window.addEventListener("load", this.onPageLoaded);
    }

    public onPageLoaded() {
        this._safeLoadQueue.forEach(this.safeLoad);
        window.removeEventListener("load", this.onPageLoaded);
    }

    // execute the callbacks after the page is loaded
    private safeLoad(cb: () => void) {
        if (document.readyState === "complete") {
            cb();
        } else {
            this._safeLoadQueue.push(cb);
        }       
    }

    // create virtual dom object from given parameters
    public ce(
        tagName: ITagName, {
            attrs = {} as IAttrs,
            children = [] as IChilds,
        } = {} as Partial<Omit<IVDOM.Children, 'tagName'>>
    ): IVDOM.Children {
        if (!attrs) attrs = {};
        if (!children) children = [];

        if (attrs['children']) {
            children.push(attrs['children']);
            delete attrs['children'];
        }

        const elem: IVDOM.Children = Object.assign(Object.create(null), {
            tagName,
            attrs,
            children,
        });

        forEach(children.filter(x => typeof x === 'object' && x !== null), (child: IVDOM.Children) => {
            if (!child.attrs) child.attrs = {};
            child.parent = elem;
        })
        return elem;
    }

    // check if property key is an event property key or no (ex. onclick, onmousedown, onkeydown etc)
    private isEventProp(name: string): boolean {
        return /^on/.test(name);
    }

    // assign a new attribute/event to given element
    private setAttribute($el: IGlobal.DOM, k: string, v: any): IGlobal.DOM {
        if (this.isEventProp(k)) {
            if (v) this.events.addListener($el, k.substr(2).toLowerCase(), v);
        } else if (~['key', 'ref', 'html', 'build', 'hookKey'].indexOf(k)) {
            if (k === 'ref') {
                const type = typeof v;
                if (type === 'function') {
                    v($el);
                } else if (Array.isArray(v)) {
                    const [obj, key] = v;
                    obj[key] = $el;
                } else if (type === 'object' && v) {
                    v.current = $el;
                }
            } else if (k === 'html') {
                $el.innerHTML = v;
            }
        } else if ($el.getAttribute(k) !== v) {
            if (k === 'className') { 
                k = 'class';
                if (Array.isArray(v)) v = v.join(' ');
            } else if (k === 'style' && v && typeof v === 'object') {
                v = toStyle(v);
            }
            if (v || typeof v === 'number' || $el.getAttribute(k)) $el.setAttribute(k, v);
        }
        return $el;
    }

    // remove attributes/event from given element
    private removeAttribute($el: IGlobal.DOM, k: string): IGlobal.DOM {
        if (this.isEventProp(k)) {
            this.events.removeListener($el);
        } else if (~['ref', 'key', 'html', 'build', 'hookKey'].indexOf(k)) {
            if (k === 'html') {
                $el.innerHTML = '';
            } else if (k === 'ref') {
                if (!$el.vRef) return $el;
                const v = $el.vRef.attrs[k];
                const type = typeof v;
                if (Array.isArray(v)) {
                    const [obj, key] = v;
                    obj[key] = null;
                } else if (type === 'object' && v) {
                    v.current = null;
                }
            } else if (k === 'hookKey' && $el.vRef) {
                const v: symbol = $el.vRef.attrs.hookKey;
                const hook = this.hookMap[v];
                console.info('remove HOOK ---', { ...hook }, 'e', $el.vRef)
                delete this.hookMap[v];
            }
        } else if (k === 'className') {
            $el.className = '';
        } else if ($el.getAttribute(k)) {
            $el.removeAttribute(k);
        }
        return $el;
    }

    // remove all custom attribute from element
    private removeAttributes($el: IGlobal.DOM, attrs: KeyValuePair<any>): void {
        for (const k in attrs) { this.removeAttribute($el, k); }
    }

    // Replace existing DON elem with newly created one (note: newEl could be virtual DOM element or real element)
    public mount($oldEl: IGlobal.DOM, newEl?: IGlobal.DOM | IVDOM.Children | Node): IGlobal.DOM {
        const $newEl: any = newEl && newEl.nodeType ? newEl as IGlobal.DOM : this.render(newEl as IVDOM.Children);
        if (!this.$root || $oldEl === this.$root) {
            this.$root = $newEl;
        }
        // update $elem reference in vDom structure for replaced elem
        if ($oldEl.vRef && $newEl.nodeType === 1) {
            $oldEl.vRef.$elem = $newEl;
            if ($oldEl.vRef.parent) $newEl.vRef.parent = $oldEl.vRef.parent;
        }
        this.removeChilds($oldEl);
        $oldEl.isMounted = false;
        $oldEl.replaceWith($newEl);
        $newEl.isMounted = true;
        return $newEl;
    }

    // insert child into an parent virtual dom object
    public insertChild($el: IGlobal.DOM, vChild: IVDOM.Children): void {
        if (!$el || !$el.nodeType || !$el.vRef ) { console.error('Not assigned virtual DOM for real DOM', $el); }
        const vParent = $el.vRef;
        if (!vParent || !vParent.children) return;
        const children = [ ...vParent.children, vChild ];
        const newVParent = { ...vParent, children };
        console.log('update childs for ', vParent);
        vChild.parent = vParent;
        this.mount($el, this.render(newVParent) as IGlobal.DOM);
    }

    // arranging the arrays
    private zip(xs: IVDOM.NodeModifier[], ys: NodeListOf<ChildNode>): [IVDOM.NodeModifier, ChildNode][] {
        const zipped: [IVDOM.NodeModifier, ChildNode][] = [];
        const max = Math.min(xs.length, ys.length);
        let i = 0;
        for (; i < max; i++) zipped.push([xs[i], ys[i]]);
        return zipped;
    }

    /*
        mountCb: cb,
        dep: dep,
        lastDep: undefined,
        shouldRun: true,
    */

    // diffing the attributes and return the patcher function (ex. updateAttrs(oldAttrs, newAttrs)(element))
    private updateAttrs(oldAttrs: KeyValuePair<any>, newAttrs?: KeyValuePair<any>): IVDOM.NodeModifier {
        const updates: IVDOM.Update[] = [];

        // remove old attributes
        for (const k in oldAttrs) {
            if (newAttrs && k in newAttrs && !this.isEventProp(k)) continue;
            updates.push(($node: IGlobal.DOM) => this.removeAttribute($node, k));
        }

        // set the new attribute
        if (newAttrs) {
            objFor<IAttrs>(newAttrs, (k, v) => updates.push(($node: IGlobal.DOM) => this.setAttribute($node, k, v)));
        }
        
        return (($node: IGlobal.DOM) => {
            forEach(updates, (update: IVDOM.Update) => update($node));
            // remove & cache the old hook
            const oldHook: IVDOM.Hook = oldAttrs.hookKey && this.hookMap[oldAttrs.hookKey];
            const newHook: IVDOM.Hook = newAttrs && newAttrs.hookKey && this.hookMap[newAttrs.hookKey];

            if (newHook && newHook.effect && newHook.effect.shouldRun) {
                // && oldHook && oldHook.effect
                if (!oldHook || !newHook.effect.dep || (oldHook.effect && oldHook.effect.lastDep !== newHook.effect.lastDep)) {
                    console.log({...newHook}, {...oldHook}, newHook.effect.shouldRun )
                    newHook.effect.unmountCb = newHook.effect.mountCb() as IVDOM.EffectCb;
                }
            }
            
            if (oldHook && (!newAttrs || oldAttrs.hookKey !== newAttrs.hookKey)) {
                delete this.hookMap[oldAttrs.hookKey];
            }

            return $node;
        }) as IVDOM.NodeModifier1;
    }

    // return patcher, which convert virtual dom child into real dom and insert into an parent element
    private appendUpdateCb(child: IVDOM.Children) {
        return ($node: IGlobal.DOM) => {
            $node.appendChild(this.render(child));
            return $node;
        }
    }

    // diffing the children between 2 virtual dom tree
    private updateChildren(oldVChildren: IVDOM.Children[], newVChildren: IVDOM.Children[]) {
        const childUpdates: IVDOM.NodeModifier[] = [];
        const additionalUpdates: IVDOM.NodeModifier[] = [];
        
        forEach(oldVChildren, (oldVChild: IVDOM.Children, i: number) => childUpdates.push(this.update(oldVChild, newVChildren[i])));
        concat(additionalUpdates, map(newVChildren.slice(oldVChildren.length), this.appendUpdateCb));

        return ($parent: IGlobal.DOM) => {
            const updates = this.zip(childUpdates, $parent.childNodes);
            forEach(updates, ([update, $child]) => update($child as IGlobal.DOM));
            forEach(additionalUpdates, (update: any) => update($parent));
            return $parent;
        };
    }

    // compare the 2 virtual dom tree and return patcher function (ex. update(oldTree, newTree)(element))
    private update(oldVTree: IVDOM.Children, newVTree?: IVDOM.Children): IVDOM.NodeModifier {
        if (newVTree === undefined) {
            if (oldVTree && oldVTree.attrs && oldVTree.attrs.hookKey) { console.log('remove elem'); }
            return ($node: IGlobal.DOM = this.$App) => {
                this.removeElement($node);
                return undefined;
            }
        }

        if (typeof oldVTree !== 'object' || typeof newVTree !== 'object') {
            if (oldVTree !== newVTree) {
                return ($node: IGlobal.DOM = this.$App) => this.mount($node, newVTree);
            } else {
                return ($node: IGlobal.DOM = this.$App) => $node;
            }
        }

        if (oldVTree.tagName !== newVTree.tagName) {
            if (oldVTree.attrs.hookKey) { console.log('replace elem'); }
            return (($node: IGlobal.DOM) => this.mount($node, newVTree)) as IVDOM.NodeModifier1;
        }

        return ($node: IGlobal.DOM = this.$App) => {
            newVTree.$elem = $node;
            $node.vRef = newVTree;
            if (this.isElement($node)) {
                this.updateAttrs(oldVTree.attrs, newVTree.attrs)($node);
                this.updateChildren(oldVTree.children || [], newVTree.children || [])($node);
            }
            return $node;
        };
    }

    private isElement($el: any): boolean {
        return typeof $el === 'object' && $el.nodeType === 1;
    }

    private injectAttrs(vElem: IVDOM.Children, attrs: IAttrs) {
        objMerge(vElem.attrs, attrs);
        return vElem;
    }

    // Attribute propagation-
    public attrDown(childs: IChilds, downAttrs: IAttrs) {
        if (!childs || !childs.length || !downAttrs) return;
        childs.forEach((x, i) => {
            if (x && x.attrs && x.attrs.build) {
                const [func, attrs] = x.attrs.build;
                const newTree = func({...attrs, ...downAttrs}) as IVDOM.Children;
                childs[i] = newTree;
            }
        });
    }

    public find(tagName: ITagName, attrs: KeyValuePair<any>, container: IVDOM.Children = this.App) {
        const attrArr = attrs ? attrs.split(',').map(x => x.split('=')) : [];
    }

    // loop over all child and call the removeElement method
    private removeChilds($elem: IGlobal.DOM): void {
        if (!$elem.children) { return; }
        forEach(toArray($elem.children), ($el) => this.removeElement($el as IGlobal.DOM));
    }

    // remove real dom element but also remove attributes and set isMount property to false (call unmount callback)
    public removeElement($elem: IGlobal.DOM): void {
        if (!$elem) { return; }
        if ($elem.children) { this.removeChilds($elem); }
        const oldTree = $elem.vRef;
        if (oldTree) {
            const attrs = oldTree.attrs;
            if (Object.keys(attrs).length) this.removeAttributes($elem, attrs);
            this.events.removeListener($elem);
        }
        // remove from DOM tree
        $elem.remove();
        // Mysterious solution, add into another div then we use innerHTML and that remove from memory
        // but maybe i will reuse the DOM in future
        this.$recycleBin.appendChild($elem);
        this.$recycleBin.innerHTML = '';
    }

    // convert virtual dom element into real dom element and insert his childrens
    public renderElem({ tagName = 'div', attrs, children = [] }: IVDOM.Children) {
        const namespace: string = this.namespacedTags[tagName];
        const $el: IGlobal.DOM = namespace
            ? document.createElementNS(namespace, tagName) as IGlobal.DOM
            : document.createElement(tagName) as IGlobal.DOM;
        this.updateAttrs([], attrs)($el);
        forEach(children, (x: IVDOM.Children) => $el.appendChild(this.render(x)));
        return $el;
    }

    // convert virtual dom object into real dom element, assign his virtual dom object and return the real dom
    public render(vNode: IVDOM.Children): IGlobal.DOM | Node {
        if (typeof vNode !== 'object') return document.createTextNode(vNode || '');
        const $elem: IGlobal.DOM = this.renderElem(vNode);
        $elem.vRef = vNode;     // get virtual DOM from real Elem
        vNode.$elem = $elem;    // get the real DOM from virtual DOM
        return $elem;
    }

    // update & render a virtual dom subtree
    public renderSubTree($oldElem: IGlobal.DOM, a: IBuildCustomElem, b: any): void {
        const oldTree = $oldElem.vRef;
        b['oldSym'] = (oldTree as any).attrs.hookKey;
        const newTree = this.build(a, b);
        if (!oldTree) {
            console.error('Virtual tree on dom not exist!');
            this.mount($oldElem, newTree);
            return;
        }
        const vParent = oldTree.parent as IVDOM.Children;
        const idx = vParent.children.findIndex(x => x === oldTree);
        vParent.children[idx === -1 ? 0 : idx] = newTree;
        newTree.parent = vParent;
        // newTree.attrs.hookKey = oldTree.attrs.hookKey;
        // newTree.attrs.build = oldTree.attrs.build;
        $oldElem.vRef = newTree;
        const $newElem = this.update(oldTree, newTree)($oldElem) as IGlobal.DOM;
        $newElem.vRef = newTree;
    }

    // update & render the whole virtual dom tree
    public renderWholeTree(vTree: IVDOM.Children): void {
        if (!this.$App) {
            this.App = vTree;
            this.$App = this.renderElem(this.App);
            this.$root.appendChild(this.$App);
        } else {
            this.$App = this.update(this.App, vTree)(this.$App) as IGlobal.DOM;
            this.App = vTree;
        }
    }

    public hookSetter<S>(key: symbol) {
        return (value: S) => {
            const hook = this.hookMap[key]
            if (!hook) return console.error('Hook setter: Hook not exist', value);
            if (!hook.vElem) return console.error('Hook setter: Missing the vElem from the hook', hook, value);
            hook.state = value;
            const $el = hook.vElem.$elem;
            if (!$el) return console.error('Hook setter: Missing element from vTree', hook);
            this.hookKey = key;
            this.renderSubTree($el, hook.build, hook.props);
            this.hookKey = undefined;
        };
    }

   public useState<S>(initValue: S): IVDOM.UseState<S> {
        if (this.hookKey) {
            let hook: IVDOM.Hook = this.hookMap[this.hookKey];
            if (!hook) {
                this.hookMap[this.hookKey] = hook = {
                    id: this.hookKey
                };
            }
            if (!hook.setter) {
                hook.state = initValue;
                hook.setter = this.hookSetter(this.hookKey);
            }
            return [hook.state, hook.setter];
        } else {
            console.error('Use useState in functional component!')
            return [null as any, (e) => {}];
        }
    }

    public useEffect(cb: IVDOM.EffectCb, dep?: IVDOM.EffectDep): void {
        if (this.hookKey) {
            // EffectCb
            let hook: IVDOM.Hook = this.hookMap[this.hookKey];
            if (!hook) {
                this.hookMap[this.hookKey] = hook = {
                    id: this.hookKey
                };
            }
            if (!hook.effect) {
                hook.effect = {
                    mountCb: cb,
                    dep: dep,
                    lastDep: undefined,
                    shouldRun: true,
                }
            }
            const stringDep = dep ? JSON.stringify(dep) : undefined;
            hook.effect.shouldRun = !dep || stringDep !== hook.effect.lastDep;
            hook.effect.lastDep = stringDep;
        } else {
            console.error('Use useEffect in functional component!')
        }
    }

    public useRef(): IVDOM.Ref {
        return {
            current: null
        };
    }

    public build(element: string | IBuildCustomElem, attrs: IAttrs = {}, ...children: IVDOM.Children[] | IVDOM.Children[][]): IVDOM.Children {
        children = (children ? flat(children as IVDOM.Children[], 1) : []);
        if (typeof element === 'function') {
            let key = Symbol('fn');
            if (attrs && attrs['oldSym']) {
                key = attrs['oldSym'];
                delete attrs['oldSym'];
            }
            this.hookKey = key;
            attrs = { ...(attrs || {}), children: children};
            const vElem = element(attrs) as IVDOM.Children;
            vElem.attrs.build = [element, attrs] as IBuildAttr;
            if (vElem.tagName === 'form' && attrs['model']) {
                this.attrDown(vElem.children, { model: attrs.model } as IAttrs);
            }
            if (this.hookMap[key]) {
                const hook: IVDOM.Hook = this.hookMap[key];
                hook.build = element;
                hook.props = attrs;
                hook.vElem = vElem;
                vElem.attrs.hookKey = key;
            }
            this.hookKey = undefined;
            return vElem;
        }
        return this.ce(element, { attrs, children } as Omit<IVDOM.Children, 'tagName'>);
    }

    // rerender the virtual dom tree based on route data
    public loadPage(routeComponents: IVDOM.CallSignature[], params: KeyValuePair<string>): void {
        let vComponent: IVDOM.Children | undefined;
        this.lastPageData = [routeComponents, params];
        document.title = 'Loading';

        forEach(routeComponents, (currentVComponent: IVDOM.CallSignature) => {
            vComponent = currentVComponent(vComponent ? [vComponent] : [], params);
        });
        if (!vComponent) return console.error('vComponent not exist!');
        this.renderWholeTree(vComponent);
    }

    // refresh the whole dom tree with last data
    public refresh(): void {
        this.loadPage(...this.lastPageData);
    }
}


export const vDom = new VDom('#root');

export const build = vDom.build;
export const ce = vDom.ce;
export const mount = vDom.mount;
export const render = vDom.render;
export const renderElem = vDom.renderElem;
export const refresh = vDom.refresh;
export const removeElement = vDom.removeElement;
export const renderSubTree = vDom.renderSubTree;
export const attrDown = vDom.attrDown;
export const useState = vDom.useState.bind(vDom);
export const useEffect = vDom.useEffect.bind(vDom);
export const useRef = vDom.useRef;

declare global {
    export namespace JSX {
        interface Element extends IVDOM.Children { }
        interface IntrinsicElements { 
            [key: string]: any;
        }
    }
}

// test purpose
// @ts-ignore
window.vDom = vDom;
