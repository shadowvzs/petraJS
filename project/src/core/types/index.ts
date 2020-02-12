export interface IEntity {
    id: number;
    created: string;
    updated: string;
}

export interface IFPromise<T> extends Promise<T> {
    isPending?: boolean;
    isResolved?: boolean;
    isRejected?: boolean;
    result?: IRequest.ApiResponse<T>;
}

export type IFP<T> = IFPromise<IRequest.ApiResponse<T>>

/*
----------------------------------------------
----------------- Global types----------------
----------------------------------------------
*/

export type ObjPart<T, K> = Partial<Record<keyof T, K>>;
export type ObjPartAny<T> = Partial<Record<keyof T, any>>;
export type StrKeyOf<T> = Extract<keyof T, string>;

export interface KeyValuePair<T> {
    [key: string]: T;
}

export type ValueOf<T> = T[keyof T];

export declare namespace IGlobal {

    export interface DOM extends HTMLElement {
        childNodes: NodeListOf<ChildNode>;
        dataset: KeyValuePair<string>;
        isMounted?: boolean;
        nodeType: number;
        setAttribute: (key: string, value: any) => void;
        uuid?: string;
        vRef?: IVDOM.Children;
    }

    export interface Scope {
        store: any;
        services: any;
        vDom: IVDOM.Core,
        events: IEvents.Core,
        router?: IRouter.Core;
        config: {
            root: HTMLElement
        }
    }
}

export type IGlobalEventConfig = [any, string];

export interface MouseClickEvent extends MouseEvent {
    target: HTMLElement;
}

/*
----------------------------------------------
------------------- Request ------------------
----------------------------------------------
*/

export declare namespace IRequest {

    interface Data<T> {
        data: T | any;
        error: any;
        message?: any;
    }

    type ApiResponse<T> = { data: T | any, error: any }

    type Response<T> = Promise<ApiResponse<T>>

    interface ConnectionError {
        code: number,
        message: string
    }

    type Callback = () => void;
    type ContentType = 'multipart/form-data' | 'application/x-www-form-urlencoded';
    type ResponseType = 'json' | 'text' | 'document' | 'blob' | 'arraybuffer';
    type EventCallback = (arg0: ProgressEvent) => void;

    interface Config {
        abort?: true | Callback;
        cache?: boolean;
        data?: KeyValuePair<any>;
        file?: File;
        header?: KeyValuePair<string>;
        method?: Method;
        progress?: EventCallback;
        contentType?: string;
        responseType?: ResponseType;
        timeoutLimit?: number;
    }

    type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

    interface InjectedServices {
        notify?: any;
    }
}

export declare namespace JSS {
    type StyleRule = { [key: string]: string | number };

    interface CssProperties {
        [key: string]: string | number | CssProperties;
    }

    type WithStyle = KeyValuePair<CssProperties>;
}

/*
----------------------------------------------
---------------- Virtual DOM -----------------
----------------------------------------------
*/

export declare namespace IVDOM {
    type Childrens = Children[];
    type NodeModifier1 = (arg0?: IGlobal.DOM) => IGlobal.DOM;
    type NodeModifier2 = (arg0?: IGlobal.DOM) => undefined;
    type NodeModifier = NodeModifier1 | NodeModifier2;
    type CallSignature = (arg0: Childrens, params: KeyValuePair<string>) => Children;
    type partialChildren = Pick<Children, 'attrs' | 'children'>;
    type Event = MouseEvent | KeyboardEvent | PopStateEvent;
    type EventHandler = (event: Event) => void;
    type Update = ($node: IGlobal.DOM) => IGlobal.DOM;
    type ISetRef = (ref: HTMLElement) => void;
    type UseState<S> = [S, (state: S) => void]
    type Ref = { current: HTMLElement | null };
    interface Hook<S = any, P = any> {
        id: Symbol;
        props?: KeyValuePair<any>;
        state?: S;
        vElem?: IVDOM.Children;
        build?: (props: P) => JSX.Element;
        effect?: Effect;
        setter?: (state: S) => void;
    }

    type EffectCbFn = () => void;
    type EffectCb = () => EffectCbFn | void;
    type EffectDep = any[] | undefined;
    interface Effect {
        mountCb: EffectCb;
        unmountCb?: EffectCb;
        dep: EffectDep;
        lastDep?: string;
        shouldRun?: boolean;
    }
   
    interface HookMap {
        [Symbol.toStringTag](): Hook;
    }
        
    interface IFallbackProps {
        ref: ISetRef
    }
    
    interface ILoader<T> {
        fallback?: (props: T) => IVDOM.Children | IVDOM.Children;
        promise: IFPromise<any>;
        final: (props: T) => IVDOM.Children | IVDOM.Children;
        [key: string]: any;
    }

    interface Children {
        attrs: KeyValuePair<any>,
        children: Childrens;
        $elem?: IGlobal.DOM;
        nodeType?: 0;
        parent?: Children;
        tagName: string;
    }

    interface Core {
        $App: IGlobal.DOM;                  // inserted real DOM tree
        $root: IGlobal.DOM;                 // root where we insert our tree
        App: IVDOM.Children;                // Virtual DOM tree
        ce: (tagName: string, arg1: partialChildren) => Children;
        insertChild: ($el: IGlobal.DOM, vChild: IVDOM.Children) => void;
        loadPage: (routeComponents: IVDOM.CallSignature[], params: KeyValuePair<string>) => void;
        renderSubTree: ($oldElem: IGlobal.DOM, Cmp: (arg0: any) => JSX.Element, props: any) => void;
        // renderSubTree: ($oldElem: IGlobal.DOM, newTree: IVDOM.Children) => void;
        renderWholeTree: (vComponent: IVDOM.Children) => void;
    }
}

/*
-------------------------------------------------
----------------- Event Handler -----------------
-------------------------------------------------
*/

export declare namespace IEvents {
    type Event = (MouseEvent | KeyboardEvent | PopStateEvent) & { prevent?: () => void };
    type EventCallback = (event: Event) => void;

    type EventCondition = (event: Event) => boolean;
    type Condition = Element | (EventCondition | boolean);

    type NodeListener = [Element, EventCallback];
    type ConditionalListener = [EventCondition | boolean, EventCallback];

    type Listener = NodeListener | ConditionalListener;
    type Listeners = KeyValuePair<Listener[]>;

    interface Core {
        addListener: (condition: IEvents.Condition, type: string, cb: IEvents.EventCallback) => void;
        removeListener: (condition: IGlobal.DOM | IEvents.EventCallback, type?: string) => void;
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
        matchedRoute: IRouter.Route | any;
        matchedUrl: string;
        params: KeyValuePair<string>;
        urlArray: string[];
        components: (() => IVDOM.Children)[];
    }

    export interface Config {
        $routeList: Route[];
        defaultRoute?: Route;
        error?: (url: string) => void;
        success?: (data: Data) => void;
    }

    interface IURL_DATA_BASE {
        DIR: string;
        HOSTNAME: string;
        ROOT: string;
        PROTOCOL: string;
    }

    interface IURL_DATA_DYNAMIC {
        HASH: null | string;
        PARAMS: KeyValuePair<string>;
        QUERY: KeyValuePair<string>;
        URL: null | string;
    }

    export interface IURL_DATA {
        BASE: IURL_DATA_BASE,
        DYNAMIC: IURL_DATA_DYNAMIC;
    }

    export interface HistoryItem {
        props?: object | null;
        url: string;
        title?: string;
    }

    export interface Core {
        history: HistoryItem[];
        redirect: (url?: string, title?: string, props?: object) => void;
    }
}
