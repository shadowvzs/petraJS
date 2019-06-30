import { IVDOM, KeyValuePair } from "../types";
import { vDom  } from "../core/VDom";
import VHeader from "./Header";

const VErrorPage = (children: IVDOM.Children[] = [], params: KeyValuePair<any> = {}) => {
	document.title = `Something went wrong!`;

     const elem = vDom.ce('section', {
         attrs: {
			 class: 'page error-page d-flex flex-column'
         },
         children: [
			 VHeader(),
			  vDom.ce('div', {
				  attrs: {
					  class: 'd-flex flex-vcenter flex-hcenter h100 w100'
				  },
				  children: [
					  vDom.ce('img', {
		                  attrs: {
		                      src: 'https://blog.hubspot.com/hs-fs/hubfs/css-tricks-404-page.png?width=477&height=383&name=css-tricks-404-page.png'
		                  }
		              })
				  ]
			  })
         ]
     });
	 console.log(elem)
     return elem;
}

export default VErrorPage;
