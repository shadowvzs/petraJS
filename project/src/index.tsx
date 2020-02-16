import { router } from "@core/Router";
import { IRouter } from "@typo";

import HomePage from "./HomePage";
import ArticlePage from "./ArticlePage";

import { vDom } from "@core/VDom";

// Hacky console LOGO message 4 fun
console.log('%c PetraJS', 'color:white;font-size: 56px;text-shadow: 1px 0 1px #000, 0 1px 1px #000, -1px 0 1px #000, 0 -1px 1px #000,5px 5px 5px rgba(0,0,0,0.5);font-weight: bold;background:linear-gradient(to bottom, #ddf,#88a, #ddf);width:7em;display:block;text-align:center;border-radius:50px 0 50px 0;border:1px solid #000;margin: 20px auto;box-shadow: 0 0 10px 10px rgba(0,0,100,0.3);font-family:arial;')


const routeMap: IRouter.Route[] = [
    ['', [], HomePage, null],
    ['home', [], HomePage, null],
    ['article/:category/:slug', ['NUMBER', 'SLUG'], ArticlePage, null],
];

const routerConfig: IRouter.Config = {
    // route map and this we pass to router class
    $routeList: routeMap,
    vDom: vDom,
    // callback for valid routes, debug purpose
    success: (routeData: IRouter.Data) => { console.log('%c Route matched callback', 'color:#070;font-size:14px;', routeData.matchedUrl) },
    // callback for invalid routes, debug purpose
    error: (url: string) => { console.log('%c Route assignment missing', 'color:red;font-size:20px', url) },
}

// start the project
// it is check the url and compare with routeMap
//   - go over each routeMap array and check if route match and if yes then call the component 
//      ex. ['home', [], HomePage, null] - localhost/home -> mount HomePage component into div#root in index.html
//   - a more complex route when we need dynamic url params like category id and article slug:
//      ex. ['article/:category/:slug', ['NUMBER', 'SLUG'], ArticlePage, null], - localhost/article/2214/my-article-name-2
//          this verify the static part (article) and check if :category and :slug is valid number and slug with RegExp 
//          if everything ok then we mount ArticlePage component and send this dynamic url params into component like: 
//                      { category: 2214, slug: '2214/my-article-name-2' }
router.init(routerConfig);
