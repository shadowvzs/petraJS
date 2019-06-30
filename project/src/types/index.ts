/*
----------------------------------------------
----------------- Global types----------------
----------------------------------------------
*/

export interface KeyValuePair<T> {
    [key: string]: T;
}

export declare namespace IGlobal {

    export interface DOM extends Element {
        dataset: KeyValuePair<string>;
        setAttribute: (key: string, value: any) => void;
    	uuid?: string;
        nodeType: number;
        vRef?: any;
        childNodes: NodeListOf<ChildNode>;
    }

    export interface Scope {
    	auth: any;
        controller: Controller,
        globalEvents: globalEvents;
    	store: any;
        vTree: IVDOM.Children;
    	$router?: IRouter.Core;
    	config: {
    		root: HTMLElement
    	}
    }

    export interface Controller {
        $scope: Scope;
        domObserver: MutationObserver;
        domObserverCallback: (mutations: MutationRecord[], observer: MutationObserver) => void;
        globalEvents: IGlobalEventConfig[]
        addEventListener: (type: string, callbacks: IEventListener[]) => void;
        loadPage: (routeComponents: IVDOM.CallSignature[], params: KeyValuePair<string>) => void;
    }
}

export interface IObserverOptions {
    childList?: boolean;
    attributes?: boolean;
    subtree?: boolean;
    characterData?: boolean;
    attributeOldValue?: boolean;
    characterDataOldValue?: boolean;
    attributeFilter?: string[];
}

export type IEventListener  = (event: MouseEvent | KeyboardEvent | PopStateEvent) => void;

export type IGlobalEventConfig = [any, string];

export interface MouseClickEvent extends MouseEvent {
  target: HTMLElement;
}

interface globalEvents {
    [key: string]: any[];
}

/*
----------------------------------------------
---------------- Virtual DOM -----------------
----------------------------------------------
*/

export declare namespace IVDOM {

    type Childrens = Children[];

    type NodeModifier = (arg0?: IGlobal.DOM) => IGlobal.DOM | ChildNode | undefined;

    type CallSignature = (arg0: Childrens, params: KeyValuePair<string>) => Children;

    interface Children {
        tagName: string;
        attrs: KeyValuePair<any>,
        children: Childrens;
        events: KeyValuePair<any>,
        $elem?: IGlobal.DOM;
        parent?: Children;
        nodeType?: 0;
    }

    type partialChildren = Pick<Children, 'attrs' | 'children' | 'events'>;

    interface Core {
        $root: IGlobal.DOM;
        App: any;
        $App: IGlobal.DOM;

        ce: (tagName: string, arg1: partialChildren) => Children;
        setAttribute: ($el: IGlobal.DOM, k: string, v: any) => IGlobal.DOM;
        removeAttribute: ($el: IGlobal.DOM, k: string) => IGlobal.DOM;
        mount: ($oldEl: IGlobal.DOM, newEl: IGlobal.DOM | IVDOM.Children) => IGlobal.DOM;
        insertChild: ($el: IGlobal.DOM, vChild: IVDOM.Children) => void;
        // zip: <Y>(xs: NodeModifier[], ys: Y[]) => (NodeModifier | Y)[][];
        isEventProp: (name: string) => boolean;
        updateAttrs: (oldAttrs: KeyValuePair<any>, newAttrs: KeyValuePair<any>) => NodeModifier;

        render: (vNode: IVDOM.Children) => IGlobal.DOM | Node;
    }
}


/*
----------------------------------------------
-------------- Router and Routes -------------
----------------------------------------------
*/


export type IRoute = [string, string[] | null, any, IRouter.Route | null ];
//export type IRoute = [string, string[] | null, IComponent.BaseConstructor, IRouter.Route | null ];

export declare namespace IRouter {

    export interface UrlError {
        [key: string]: [number, string];
    }

    export interface Route extends IRoute { }

    export interface Data {
    	depth: number;
    	components: (() => IVDOM.Children)[];
    	params: KeyValuePair<string>;
    	matchedUrl: string;
    	urlArray: string[];
    	matchedRoute: IRouter.Route | any;
    }

    export interface Config {
    	$scope: IGlobal.Scope;
    	$routeList: Route[];
    	defaultRoute?: Route;
    	success?: (data: Data) => void;
    	error?: (url: string) => void;
    }

    interface IURL_DATA_BASE {
        PROTOCOL: string;
        HOSTNAME: string;
        DIR: string;
        ROOT: string;
    }

    interface IURL_DATA_DYNAMIC {
        HASH: null | string;
        QUERY: KeyValuePair<string>;
        URL: null | string;
        PARAMS: KeyValuePair<string>;
    }

    export interface IURL_DATA {
        BASE: IURL_DATA_BASE,
        DYNAMIC: IURL_DATA_DYNAMIC;
    }

    export interface HistoryItem {
    	url: string;
        title?: string;
    	props?: object;
    }

    export interface Core {
        $scope: IGlobal.Scope;
        URL_DATA: IURL_DATA;
        MOUSE_BUTTON: string[];
        history: HistoryItem[];
        data: IRouter.Data | object;
        createGlobalClickEvent(): void;
        dispatchRoute(URL: string): void;
        getPath(): IURL_DATA_DYNAMIC;
        getTarget(e: HTMLElement): string;
        onBack(event: PopStateEvent): void;
        onClick(event: MouseClickEvent): void;
        registerRouter(): void;
        validateRoute(config: Route, data: Data): Data | false;
    	// finalValidation
    }
}
