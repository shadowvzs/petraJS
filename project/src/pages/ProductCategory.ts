import { IVDOM, KeyValuePair } from "../types";
import { getCategoryList } from "../database/local";
import { vDom  } from "../core/VDom";

const VProductCategory = (productSubCategoryComponent: IVDOM.Children[] = [], params: KeyValuePair<any> = {}) => {
	const { category } = params;
	 document.title = `/${category}` + document.title;
	 console.log(params)
	 const list: IVDOM.Children[] = [];

	 const subcategory = getCategoryList(category);

 	 if (subcategory.length) {
 			subcategory.forEach(({ slug, title, src}) => {
 				list.push(vDom.ce('a', {
 					attrs: {
 						class: params.subcategory === slug ? 'card active' : 'card',
 						href: `/product/${category}/${slug}`
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
 				 `Not found any sub category in ${category}`
 			]
 		 }));
 	 }


     const elem = vDom.ce('div', {
         attrs: {
			 class: 'product-category'
         },
         children: [
             ...[
				 vDom.ce('h2', {
                     children: ['Product Category']
                 }),
				 ...list,
             ],
			 ...productSubCategoryComponent,
         ]
     });

     return elem;
}

export default VProductCategory;
