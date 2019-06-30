import { validate } from "./Validator";
import {
	IGlobal,
	KeyValuePair,
	MouseClickEvent,
	IRouter,
} from "../types";

export class Router implements IRouter.Core {
    public $scope: IGlobal.Scope;
	public URL_DATA: IRouter.IURL_DATA;
	public MOUSE_BUTTON: string[] = ['left', 'middle', 'right'];
    public history: IRouter.HistoryItem[] = [];
	public data: IRouter.Data | object = {};

    constructor(public config: IRouter.Config) {
        const { protocol, hostname } = location as Location;
        const baseDir = '';   // it is empty if project is in root directory
        this.URL_DATA = {
            BASE: Object.freeze({
                PROTOCOL: protocol,
                HOSTNAME: hostname,
                DIR: baseDir,
                ROOT: protocol + '//' + hostname + baseDir,
            }),
            DYNAMIC: {
                HASH: null,
                QUERY: {},
                URL: null,
                PARAMS: {}
            }
        }

        this.$scope = config.$scope;
		this.$scope.$router = this;
		this.onClick = this.onClick.bind(this);
		this.onBack = this.onBack.bind(this);
        this.registerRouter();
    }

    registerRouter() {
        if (document.readyState === 'complete') {
            this.createGlobalClickEvent();
        } else {
            document.onreadystatechange = () => {
                document.readyState === 'complete' && this.createGlobalClickEvent();
            };
        }
		const { URL } = this.getPath();
        this.dispatchRoute(URL);
    }

    createGlobalClickEvent() {
		const controller = this.$scope.controller;
		controller.addEventListener('click', [this.onClick]);
		controller.addEventListener('popprops', [this.onBack]);
		// --------------------------------------------
    }

	redirect(url?: string, title?: string, props?: object) {
        const { ROOT } = this.URL_DATA.BASE;
        const { URL } = this.getPath();

        if (url) {
            if (url === URL) { return; }
			history.pushState(null, title, ROOT + '/' + URL);
            history.replaceState(null, title, ROOT + url);
			this.history.push({url, title, props});
        }
        this.dispatchRoute(url);
    }

	onBack(event: PopStateEvent): void {
        if (!this.history.length) { return; }
        const { url, title, props } = this.history.pop();
        this.redirect(url, title, props);
        // history.back();
        event.preventDefault();
        // Uncomment below line to redirect to the previous page instead.
        // window.location = document.referrer // Note: IE11 is not supporting this.
        // history.pushprops(null, null, window.location.pathname);
    }

	getTarget(e: HTMLElement): string {
		const MAX_DEPTH = 3;
        let t = e, i = 0, href;
        for (; i < MAX_DEPTH; i++) {
            if (href = t.getAttribute("href")) {
                break;
            } else {
                if (!(t = t.parentElement)) { return 'no href on clicked target also no parent';}
            }
        }
		return href
	}

    onClick (event: MouseClickEvent): void {
        if (event.button > 0) {
            return console.log('it was not left click, it was '+(this.MOUSE_BUTTON[event.button] || 'unknow')+' button');
        }
		const href = this.getTarget(event.target);

        if (!href) { return console.log('no href where i clicked'); }
        // internal link handle redirect(url)
        if (href[0] === "/") {
            console.info('internal page link was detected', href);
            event.preventDefault();
            this.redirect(href);
        /*
        	} else if (href === '*') {
        */
        } else {
            console.log('normal link redirect to other page');
        }
    }

    getPath() {
        const { ROOT } = this.URL_DATA.BASE;
        const HASH = window.location.hash;
        const href = encodeURI(location.href);
        const full_url = href.substring(ROOT.length + 1, href.length - HASH.length);
        const QUERY: KeyValuePair<string> = {};
        const [ URL, queries = false ] = full_url.split('?');

        if (queries && queries.length) {
            queries.split('&').forEach( q => {
                const [key, value] = q.split('=');
                QUERY[key] = value;
            });
        }

        return this.URL_DATA.DYNAMIC = {
            ...this.URL_DATA.DYNAMIC,
            HASH: HASH.replace('#', ''),
            QUERY,
            URL
        };
    }

	validateRoute(config: IRouter.Route, data: IRouter.Data): IRouter.Data | false {
		const urlArray = data.urlArray.slice(data.depth);
		const params: KeyValuePair<string> = {};
		const [chunk, validations, VComponent, childConfig] = config;
		const chunkArray = chunk.split('/');

		if (chunkArray.length > urlArray.length) {
			return false;
		}

		for (let [i, v] of chunkArray.entries()) {
			if (!v) { return false; }
			if (v[0] === ':') {
				v = v.substr(1);
				const validation = validations[Object.keys(params).length];
				if (!validate(urlArray[i], validation)) { return false;}
				params[v] = urlArray[i];
			} else {
				if (v !== urlArray[i]) { return false; }
			}
		}

		data.depth += chunkArray.length;

		Object.assign(data.params, {...params});
		data.components.unshift(VComponent);

		// Component.defaultProps = { ...Component.defaultProps, ...params };
		// if exist child and we still have remining chunk in current url then go deeper
		if (Array.isArray(childConfig) && data.depth < data.urlArray.length) {
			// const [,,Child,] = childConfig;
			// Component.Childs = { ...Component.Childs, route: Child };
			return this.validateRoute(childConfig, data);
		}

		//if (Component.Childs.route) {
		//	delete Component.Childs.route;
		//}

		data.matchedUrl = '/' + data.urlArray.join('/');
		return data;
	}

    dispatchRoute(url: string): void {
		this.URL_DATA.DYNAMIC.PARAMS = {};
		let result: IRouter.Data | false;

		const defaultData: IRouter.Data = {
			depth: 0,
			components: [],
			params: {},
			matchedUrl: '',
			urlArray: url.split('/').filter(e => e),
			matchedRoute: []
		}
		const routeMap = this.config.$routeList;
		for (const config of routeMap) {
			result = this.validateRoute(config, {...defaultData, matchedRoute: config});
			if (!!result) { break; }
		}


		const { success, error } = this.config;
		if (!!result) {
			// this.redirect();
			this.URL_DATA.DYNAMIC.PARAMS = result.params;
			console.log('Route was correct!', result);
			if (success) { success(result); }
			this.$scope.controller.loadPage(result.components, result.params);
		} else {
			console.log('Route missmatch!', url);
			if (success) { error(url); }
			this.redirect('/error/404');
		}
    }
};
