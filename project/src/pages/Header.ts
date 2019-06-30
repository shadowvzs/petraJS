import { vDom  } from "../core/VDom";

const VHeader = () => {

	const links: [string, string][] = [
		['Home', '/home'],
		['Product', '/product'],
	];

	const elem = vDom.ce('header', {
		attrs: {
			class: 'd-flex flex-hcenter'
		},
        children: [
			 vDom.ce('nav', {
                 children: links.map(([name, url]) => {
					 return vDom.ce('a', {
						 attrs: { href: url, class: 'btn default' },
		                 children: [name]
		             });
				 })
             }),
        ]
    });
    return elem;
}

export default VHeader;
