import { IVDOM, KeyValuePair } from "../types";
import { vDom  } from "../core/VDom";
import { getCategoryList } from "../database/local";
import VHeader from "./Header";

const VProductPage = (categoryComponent: IVDOM.Children[] = [], params: KeyValuePair<any> = {}) => {
	const list: IVDOM.Children[] = [];
	document.title = 'Product page' + document.title;

    getCategoryList().forEach(({slug, src}) => {
	   list.push(vDom.ce('a', {
		   attrs: {
			   href: `/product/${slug}`,
			   class: params.category === slug ? 'card active' : 'card'
		   },
		   children: [
			   vDom.ce('img', {
				   attrs: {
					   src: `${src}`,
					   height: '48'
				   },
			   })
		   ]
	   }));
    });

    return vDom.ce('section', {
         attrs: {
			 class: 'page product-page'
         },
         children: [
			 VHeader(),
			 vDom.ce('h2', {
                 children: ['Welcome on the product page']
             }),

			 vDom.ce('div', {
				 attrs: { style: 'margin: auto' },
				  children: [
	 				 ...list
				  ]
			  }),
			 ...categoryComponent,
         ]
    });
}

export default VProductPage;
