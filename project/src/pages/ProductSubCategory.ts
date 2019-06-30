import { IVDOM, KeyValuePair } from "../types";
import { getCategoryProducts } from "../database/local";
import { vDom  } from "../core/VDom";


const VProductSubCategory = (productDetailsComponent: IVDOM.Children[] = [], params: KeyValuePair<any> = {}) => {
	 const { category, subcategory, product } = params;
	 const list: IVDOM.Children[] = [];
	 document.title = `/${subcategory}` + document.title;

	 const items = getCategoryProducts(subcategory);
	 if (items.length) {
 			items.forEach(({ id, slug, title, src}) => {
 				list.push(vDom.ce('a', {
 					attrs: {
 						class: product === id ? 'card active' : 'card',
 						href: `/product/${category}/${subcategory}/${slug}`
 					},
 					children: [
 						title,
 						vDom.ce('img', {
 							attrs: {
 								height: '100',
 								src: `${src}`
 							},
 						}),
 					]
 				}));
 			});
 	 } else {
 		 list.push(vDom.ce('h6', {
 			children: [
 				 `Not found any product in ${subcategory}`
 			]
 		 }));
 	 }

     const elem = vDom.ce('div', {
         attrs: {
			 class: 'product-subcategory'
         },
         children: [
             ...[
				 vDom.ce('h2', {
                     children: ['Product List:']
                 }),
				 ...list,
             ],
			 ...productDetailsComponent,
         ]
     });

     return elem;
}

export default VProductSubCategory;
