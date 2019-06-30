import { IVDOM, KeyValuePair } from "../types";
import { vDom  } from "../core/VDom";
import { getProduct } from "../database/local";

const VTable = (item: KeyValuePair<string|number>) => {
	const itemArray = Object.entries(item);
	return vDom.ce('table', {
		children: itemArray.map(([key, value]) => {
			return vDom.ce('tr', {
				 children: [
					 vDom.ce('td', {
 						 children: [key]
 					}),
					vDom.ce('td', {
						children: [value]
				   }),
				 ]
			})
		})
	})
};

const VProductDetails = (children: IVDOM.Children[] = [], params: KeyValuePair<any> = {}) => {
	const productSlug = params.product;
	const product = getProduct(productSlug);
	document.title = `/${product.title}` + document.title;

     const elem = vDom.ce('div', {
         attrs: {
			 class: 'product-details'
         },
         children: [
			 'Product details:',
			 VTable(product)
         ]
     });
	 console.log(elem)
     return elem;
}

export default VProductDetails;
