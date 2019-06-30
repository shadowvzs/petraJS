import './index.css';
import { Router } from "./core/Router";
import ProductPage from "./pages/ProductPage";
import ProductCategory from "./pages/ProductCategory";
import ProductSubCategory from "./pages/ProductSubCategory";
import ProductDetails from "./pages/ProductDetails";
import ErrorPage from "./pages/ErrorPage";
import { Controller } from "./core/Controller";
import { IGlobal, IRouter } from "./types";

const loader = document.createElement('div');
loader.textContent = 'Loading...';

const scope: IGlobal.Scope = {
	auth: {},
	config: {
		root: document.querySelector('#root')
	},
	controller: null,
	globalEvents: {},
	vTree: undefined,
	store: {},
};

const routeMap: IRouter.Route[] = [
	// example:http://172.18.0.2/pista/something/12 - mounted 3 component

	[
		'product', [], ProductPage, [
			':category', ['STRING'], ProductCategory, [
				':subcategory', ['STRING'], ProductSubCategory, [
					':product',['STRING'], ProductDetails, null
				]
			]
		]
	],
	// example:http://172.18.0.2/pista3/name/id - mounted 1 component
	['pista3/:name/:id', ['STRING', 'STRING'], ProductPage, null],
	['error/:code', ['NUMBER'], ErrorPage, null]

];


const routerConfig: IRouter.Config = {
	$scope: scope,
	$routeList: routeMap,
	success: (url) => { console.log('success', url) },
	error: (url: string) => { console.log('no match', url) },

}

// const req = new Request();
const controller = new Controller(scope);
const router = new Router(routerConfig);
// global.g = req;
// global.r = router;
