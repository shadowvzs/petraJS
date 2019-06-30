import {
    IGlobal,
    KeyValuePair,
    MouseClickEvent,
    IGlobalEventConfig,
    IObserverOptions,
    IRouter,
    IVDOM,
} from "../types";

 import { vDom  } from "./VDom";

/*
 const VProductPage = (children: IVDOM.Children[] = [], data: KeyValuePair<any> = {}) => {
     const elem = vDom.ce('div', {
         attrs: {
             id: 'repa',
             dataCount: 1
         },
         children: [
             ...children,
             ...[
                 vDom.ce('img',{
                     attrs: {
                         src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
                     }
                 }),
                 vDom.ce('h2',{
                     children: ['mount point']
                 }),
             ],
         ]
     });
     return elem;
 }

 const VProductDetails = (data: KeyValuePair<any> = {}) => {
     const elem = vDom.ce('div', {
         attrs: {
             style: 'color: red;'
         },
         children: [
             data.title,
             vDom.ce('h1',{
                 children: [(new Date()).toISOString()]
             })
         ],
     });
     return elem;
 }

 vDom.App = VProductPage();
 vDom.$App = vDom.mount(vDom.$root, vDom.App);
 // vDom.$App = vDom.mount(vDom.$App, vDom.$root);

 setInterval(() => {
     const n = Math.floor(Math.random() * 10);
     const vNewApp = VProductPage([VProductDetails({ title: 'asde' })]);
     vDom.$App = vDom.update(vDom.App, vNewApp)() as IGlobal.DOM;
     //vDom.$App = vDom.update(vDom.App, vNewApp)(vDom.$App);
     vDom.App = vNewApp;
     console.log(vDom.App)
 }, 1000);

 setTimeout(() => {
     const t = vDom.$root.querySelector('h2');
     console.log(t, vDom.$root, )
     // ----- insert -----
     // vDom.mount(t, homeVApp('homeVApp'));
     vDom.insertChild(t, VProductDetails({ title: 'inserted homeVApp'}));
 }, 5000)
*/

export class Controller implements IGlobal.Controller {
    public $scope: IGlobal.Scope;
    public domObserver: MutationObserver;
    public globalEvents: IGlobalEventConfig[] = [
        [document.body, 'click'],
        [window, 'popprops'],
    ];

    constructor(scope: IGlobal.Scope) {
        this.$scope = scope;
        scope.controller = this;
        this.registerGlobalEvents();
        // this.registerDomObserver();
    }

    registerDomObserver() {}
    unregisterDomObserver() {}
    domObserverCallback() {}
    /*
    registerDomObserver() {
        const observerOptions: IObserverOptions = {
            childList: true,
            attributes: false,
            subtree: false,
            characterData: false,
            attributeOldValue: false,
            characterDataOldValue: false,
        }

        this.domObserver = new MutationObserver(this.domObserverCallback());
        this.domObserver.observe(this.$scope.config.root, observerOptions);
    }

    unregisterDomObserver() {
        this.domObserver.disconnect();
    }
    */
    registerGlobalEvents() {
        const globalEvents = this.$scope.globalEvents;
        for (const [source, type] of this.globalEvents as IGlobalEventConfig[]) {
            globalEvents[type] = source.addEventListener(type, this.onEventHandler.bind(this));
        }

    }

    onEventHandler(event: MouseClickEvent) {
        const type = event.type;
        this.$scope.globalEvents[type].forEach(cb => cb(event));
    }

    addEventListener(type: string, callbacks: any[]) {
        const events = this.$scope.globalEvents;
        if (!events[type]) { events[type] = []; }
        events[type].push(...callbacks);
    }

    // since context is MutationObserver we need clojure for current instance
    /*
    domObserverCallback() {
        const self = this;
        return function (mutations: MutationRecord[], observer: MutationObserver): void {
            const components = null;self.$scope.components;
            let removedNodes: any;
            mutations.forEach((mutation) => {
                // filter component exist too
                removedNodes = Array.from(mutation.removedNodes)
                        .filter((elem: IGlobal.DOM) => elem.uuid && components[elem.uuid]);
                // foreach and use remove method
            });
            console.log(removedNodes)
        }
    }
    */
    loadPage(routeComponents: IVDOM.CallSignature[], params: KeyValuePair<string>) {
        let vComponent: IVDOM.Children = null;
        document.title = '';

        routeComponents.forEach((currentVComponent) => {
            vComponent = currentVComponent(vComponent ? [vComponent] : [], params);
        });

        if (!vDom.$App) {
            vDom.App = vComponent;
            vDom.$App = vDom.mount(vDom.$root, vDom.App);
        } else {
            vDom.$App = vDom.update(vDom.App, vComponent)() as IGlobal.DOM;
            vDom.App = vComponent;
        }
        this.$scope.vTree = vDom.App;
        console.log(vComponent)
    }
}
