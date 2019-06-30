import { IGlobal, KeyValuePair, IVDOM } from "../types";

class VDom implements IVDOM.Core {
    public $root: IGlobal.DOM;
    public App: IVDOM.Children;
    public $App: IGlobal.DOM;

	constructor(rootSelector = 'body') {
		this.$root = document.querySelector(rootSelector);
	}

	ce(tagName: string, { attrs = {}, children = [] } = {}): IVDOM.Children {
		const elem: IVDOM.Children = Object.assign(Object.create(null), {
	    	tagName,
	    	attrs,
	    	children,
		});
		children.forEach((child, idx) => {
			if (typeof child === 'object') {
				child.parent = elem;
                if (!child.attrs.key) { child.attrs.key = `child_${idx}`; }
			};
		});
	  	return elem;
	}

	setAttribute($el: IGlobal.DOM, k: string, v: any): IGlobal.DOM {

  		if (this.isEventProp(k)) {
			// $el[k] = v;
        } else if (['key'].indexOf(k) > -1) {

		} else if ($el.getAttribute(k) !== v) {
	    	$el.setAttribute(k, v);
		}
		return $el;
	}

	removeAttribute($el: IGlobal.DOM, k: string): IGlobal.DOM {
		$el.removeAttribute(k);
		return $el;
	}

	// Replace existing DON elem with newly created one (note: newEl could be virtual DOM element or real element)
	mount($oldEl: IGlobal.DOM, newEl?: IGlobal.DOM | IVDOM.Children | Node): IGlobal.DOM {
        console.log($oldEl, newEl)
		const $newEl: any = newEl.nodeType ? newEl as IGlobal.DOM : this.render(newEl as IVDOM.Children);
		if (!this.$root || $oldEl === this.$root) {
            this.$root = $newEl;
        }
		// update $elem reference in vDom structure for replaced elem
        // console.log($oldEl)
        if ($oldEl.vRef) {
			$oldEl.vRef.$elem = $newEl;
			if ($oldEl.vRef.parent) {
				$newEl.vRef.parent = $oldEl.vRef.parent;
			}
		}
	  	// console.log($oldEl, $newEl)
	  	$oldEl.replaceWith($newEl);
	  	return $newEl;
	}
	/*
	mount($node, $target = this.$root) {
		if (!this.$root || $target === this.$root) { this.$root = $node; }
	  	return this.replaceElem($target, $node);
	}*/

	insertChild($el: IGlobal.DOM, vChild: IVDOM.Children): void {
        console.log($el, vChild)
		if (!$el || !$el.nodeType || !$el.vRef ) { console.error('Not assigned virtual DOM for real DOM', $el); }
		const vParent = $el.vRef;
		const children = [ ...vParent.children, vChild ];
		const newVParent = { ...vParent, children };
		console.log('update childs for ', vParent);
		vChild.parent = vParent;
		this.mount($el, this.render(newVParent) as IGlobal.DOM);
	}

	zip(xs: IVDOM.NodeModifier[], ys: NodeListOf<ChildNode>): [IVDOM.NodeModifier, ChildNode][] {
	  	const zipped: [IVDOM.NodeModifier, ChildNode][] = [];
	  	for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
	    	zipped.push([xs[i], ys[i]]);
	  	}
	  	return zipped;
	}
    /*
    zip(xs: IVDOM.NodeModifier[], ys: NodeListOf<ChildNode>): [IVDOM.NodeModifier, ChildNode][] {
	  	const zipped: [IVDOM.NodeModifier, ChildNode][] = [];
	  	for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
	    	zipped.push([xs[i], ys[i]]);
	  	}
	  	return zipped;
	}
    */

	isEventProp(name: string): boolean {
		return /^on/.test(name);
	}

	updateAttrs(oldAttrs: KeyValuePair<any>, newAttrs: KeyValuePair<any>): IVDOM.NodeModifier {
	  	const updates: any[] = [];

	  	for (const [k, v] of Object.entries(newAttrs)) {
	    	updates.push(($node: IGlobal.DOM) => this.setAttribute($node, k, v));
	  	}

	  	for (const k in oldAttrs) {
	    	if (!(k in newAttrs)) {
	      		updates.push(($node: IGlobal.DOM) => this.removeAttribute($node, k));
	    	}
	  	}

	  	return ($node: IGlobal.DOM) => {
	    	for (const update of updates) {
	      		update($node);
	    	}
	    	return $node;
	  	};
	}

	updateChildren(oldVChildren: IVDOM.Children[], newVChildren: IVDOM.Children[]) {
	  	const childUpdates: IVDOM.NodeModifier[] = [];
        const additionalUpdates: IVDOM.NodeModifier[] = [];

	  	oldVChildren.forEach((oldVChild, i) => {
	    	childUpdates.push(this.update(oldVChild, newVChildren[i]));
	  	});

	  	for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
	    	additionalUpdates.push(($node: IGlobal.DOM) => {
	      		$node.appendChild(this.render(additionalVChild));
	      		return $node;
	    	});
	  	}

	  	return ($parent: IGlobal.DOM) => {
	    	const updates = this.zip(childUpdates, $parent.childNodes);
	    	for (const [update, $child] of updates) {
	      		update($child as IGlobal.DOM);
	    	}
	    	for (const update of additionalUpdates) {
	      		update($parent);
	    	}
	    	return $parent;
	  	};
	}

    appendUpdateCb(child: IVDOM.Children) {
        return ($node: IGlobal.DOM) => {
            $node.appendChild(this.render(child));
            return $node;
        }
    }

    updateChildren2(oldVChildren: IVDOM.Children[], newVChildren: IVDOM.Children[]) {

        const childUpdates: IVDOM.NodeModifier[] = [];
        const additionalUpdates: IVDOM.NodeModifier[] = [];
        const used: number[] = [];
        newVChildren.forEach((newVChild) => {
            if (typeof newVChild !== 'object') {
                const Idx = oldVChildren.findIndex((oldVChild) => typeof oldVChild !== 'object');
                if (Idx > -1) {
                    used.push(Idx);
                    childUpdates.push(this.update(oldVChildren[Idx], newVChild));
                } else {
                    additionalUpdates.push(this.appendUpdateCb(newVChild));
                }
                return;
            }

            const newKey = newVChild.attrs.key;
            if (newKey) {
                const Idx = oldVChildren.findIndex((oldVChild) => oldVChild.attrs && oldVChild.attrs.key === newKey);
                if (Idx > -1) {
                    used.push(Idx);
                    return childUpdates.push(this.update(oldVChildren[Idx], newVChild));
                }
            }

            if (used.length > oldVChildren.length) {
                additionalUpdates.push(this.appendUpdateCb(newVChild));
            }

            const oldIdx = oldVChildren.findIndex((_, i) => used.indexOf(i) === -1);
            if (oldIdx > -1) {
                used.push(oldIdx);
                childUpdates.push(this.update(oldVChildren[oldIdx], newVChild));
            } else {
                additionalUpdates.push(this.appendUpdateCb(newVChild));
            }
        });

        // deprecated elems
        oldVChildren
            .filter((_, idx) => used.indexOf(idx) === -1)
            .forEach((oldChild) => childUpdates.push(this.update(oldChild)));

        // console.log(childUpdates, additionalUpdates);
        return ($parent: IGlobal.DOM) => {
            const updates = this.zip(childUpdates, $parent.childNodes);
            for (const [update, $child] of updates) {
                update($child as IGlobal.DOM);
            }
            for (const update of additionalUpdates) {
                update($parent);
            }
            return $parent;
        };
    }

	update(oldVTree: IVDOM.Children, newVTree?: IVDOM.Children): IVDOM.NodeModifier {
	  	if (newVTree === undefined) {
	    	return ($node: IGlobal.DOM = this.$App) => {
	      		$node.remove();
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
	    	return ($node: IGlobal.DOM) => this.mount($node, newVTree);
	  	}

	  	return ($node: IGlobal.DOM = this.$App) => {
	  		newVTree.$elem = $node;
	    	this.updateAttrs(oldVTree.attrs, newVTree.attrs)($node);
	    	this.updateChildren2(oldVTree.children, newVTree.children)($node);
	    	return $node;
	  	};
	}

	renderElem({ tagName, attrs, children }: IVDOM.Children) {
	  	const $el = document.createElement(tagName);
		Object.entries(attrs).map(([k, v]) => this.setAttribute($el, k, v));
	  	for (const child of children) {
	    	$el.appendChild(this.render(child));
	  	}

	  	return $el;
	}

	render(vNode: IVDOM.Children): IGlobal.DOM | Node {
	  	if (typeof vNode !== 'object') { return document.createTextNode(vNode); }
        console.log(vNode)
	  	const $elem: IGlobal.DOM = this.renderElem(vNode);
	  	$elem.vRef = vNode;     // get virtual DOM from real Elem
	  	vNode.$elem = $elem;	// get the real DOM from virtual DOM
	  	return $elem;
	}
}

export const vDom = new VDom('#root');
