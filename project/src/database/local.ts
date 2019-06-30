const categories = [
	{
		id: 1,
		parent: 0,
		slug: 'pc',
		src: 'https://image.freepik.com/free-vector/multimedia-desktop-pc-illustration_72147494127.jpg',
		title: 'Desktop PC',
	},
	{
		id: 2,
		parent: 0,
		slug: 'laptop',
		src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT5yI5tx7AE73vO8mzQ_0WO8LKQ-DCya8m8a1wWw36VNUnpt7x',
		title: 'Laptop',
	},
	{
		id: 3,
		parent: 0,
		slug: 'smart',
		src: 'https://cdn5.vectorstock.com/i/1000x1000/18/69/smartphone-flat-icon-symbol-vector-22731869.jpg',
		title: 'Smart Device',
	},
	{
		id: 4,
		parent: 1,
		slug: 'motherboard',
		title: 'Motherboard',
		src: 'https://4.imimg.com/data4/DY/TC/MY-13558365/atx-mother-board-500x500.jpg',
	},
	{
		id: 5,
		parent: 1,
		slug: 'cpu',
		title: 'Processor',
		src: 'https://askleo.askleomedia.com/wp-content/uploads/2009/01/cpu-300x245.jpg',
	},
	{
		id: 6,
		parent: 1,
		slug: 'ram',
		title: 'Memory',
		src: 'https://c1.neweggimages.com/NeweggImage/ProductImage/20-141-164-14.jpg',
	},
	{
		id: 7,
		parent: 2,
		slug: 'case',
		title: 'Case',
		src: 'https://s12emagst.akamaized.net/products/414/413766/images/res_a2be873fdf9ca8ae11861aeba39b95b4_full.jpg',
	},
	{
		id: 8,
		parent: 2,
		slug: 'coolerpad',
		title: 'Cooler Pad',
		src: 'https://images-na.ssl-images-amazon.com/images/I/8154mTqd%2BAL._SX466_.jpg',
	},
	{
		id: 9,
		parent: 2,
		slug: 'powersupply',
		title: 'Power Supply',
		src: 'https://gd.image-gmkt.com/LAPTOP-ACCESSORIES-POWER-ADAPTER-USB-90W-19V-4-7A-ADAPTER-LAPTOP/li/155/000/1152000155.g_400-w_g.jpg',
	},
	{
		id: 10,
		parent: 3,
		slug: 'phone',
		title: 'Phone',
		src: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1551208882-samsung-galaxy-s10e-smartphone-1550695757.jpg',
	},
	{
		id: 11,
		parent: 3,
		slug: 'tablet',
		title: 'Tablet',
		src: 'https://images-na.ssl-images-amazon.com/images/I/61ul3f89uDL._SL1338_.jpg',
	},
];

const productCategories = [
	{
		id: 1,
		category_id: 4,
		product_id: 1,
	},
	{
		id: 1,
		category_id: 4,
		product_id: 2,
	},
	{
		id: 1,
		category_id: 5,
		product_id: 3,
	},
	{
		id: 1,
		category_id: 5,
		product_id: 4,
	},
	{
		id: 1,
		category_id: 6,
		product_id: 5,
	},
	{
		id: 1,
		category_id: 6,
		product_id: 6,
	},
	{
		id: 1,
		category_id: 7,
		product_id: 7,
	},
	{
		id: 1,
		category_id: 8,
		product_id: 8,
	},
	{
		id: 1,
		category_id: 8,
		product_id: 9,
	},
	{
		id: 1,
		category_id: 10,
		product_id: 10,
	},
	{
		id: 1,
		category_id: 10,
		product_id: 11,
	},
	{
		id: 1,
		category_id: 10,
		product_id: 12,
	},
	{
		id: 1,
		category_id: 11,
		product_id: 13,
	},
	{
		id: 1,
		category_id: 1,
		product_id: 14,
	},

];

const products = [
	{
		id: 1,
		title: 'MSI x470',
		slug: 'msi_x470',
		src: 'https://storage-asset.msi.com/global/picture/features/MB/Gaming/H370/h370-gaming-plus-tuning-1920.png',
		price: '100',
	},
	{
		id: 2,
		title: 'ASRock Z370M Pro4',
		slug: 'asrock_z370m_pro',
		src: 'https://c1.neweggimages.com/NeweggImage/ProductImage/13-157-793-V01.jpg',
		price: '112',
	},
	{
		id: 3,
		title: 'AMD Ryzen 7 1700X',
		slug: 'amd_ryzen7_1700x',
		src: 'https://images-na.ssl-images-amazon.com/images/I/61d5eSkfnpL._SX425_.jpg',
		price: '63',
	},
	{
		id: 4,
		title: 'Intel i7 4790',
		slug: 'intel_i7_4790',
		src: 'https://rukminim1.flixcart.com/image/704/704/jq5iky80/processor/d/c/3/intel-i7-4790-original-imafc73hheyfp8f5.jpeg?q=70',
		price: '85',
	},
	{
		id: 5,
		title: 'Kingston DDR4 8GB ',
		slug: 'kingstone_ddre_8gb',
		src: 'https://ae01.alicdn.com/kf/HTB1H7PHSFXXXXXjXFXXq6xXFXXXY/Kingston-DDR4-RAM-8GB-4GB-High-Speed-2400Mhz-Memory-Ram-Intel-Gaming-Memory-For-Desktop-Memory.jpg_640x640.jpg',
		price: '71',
	},
	{
		id: 6,
		title: 'HyperX Furry DDR4 8GB',
		slug: 'hyperx_ddr_8gb',
		src: 'https://www.evetech.co.za/repository/ProductImages/hyperx-furry-8gb-ddr4-3466mhz-black-ram-730px-v2.jpg',
		price: '71',
	},
	{
		id: 7,
		title: 'Case Logic Laps-116',
		slug: 'case_laps_116',
		src: 'https://cdna.altex.ro/resize/media/catalog/product/L/A/2bd48d28d1c32adea0e55139a4e6434a/LAPS-116-GRAPHITE_1_7766901c.jpg',
		price: '10',
	},
	{
		id: 8,
		title: 'Pad-Double Fan-10',
		slug: 'pad_double_fan_10',
		src: 'http://www.repsunny.com/wp-content/uploads/2017/11/71-HxBRZHnL._SL1000_.jpg',
		price: '10',
	},
	{
		id: 9,
		title: 'Cool Cold Fans',
		slug: 'cool_cold_fans',
		src: 'https://img.tttcdn.com/product/xy/500/500/p/gu1/C/5/C3505/C3505-1-4ce9-39qC.jpg',
		price: '16',
	},
	{
		id: 10,
		title: 'Samsung S6',
		slug: 'samsung_s6',
		src: 'https://s12emagst.akamaized.net/products/1084/1083590/images/res_bc36fc3ca1a1567ff9881122b3f2ddcb_full.jpg',
		price: '233',
	},
	{
		id: 11,
		title: 'Santin Armor IP68',
		slug: 'santin_armor_ip68',
		src: 'https://images.ua.prom.st/1011579991_w640_h640_smartfon-santin-armor.jpg',
		price: '35',
	},
	{
		id: 12,
		title: 'Bluboo S8',
		slug: 'bluuboo_s8',
		src: 'https://s12emagst.akamaized.net/products/8810/8809985/images/res_fc8c587dd6713515e7715605a5a5bb38_full.jpg',
		price: '46',
	},
	{
		id: 13,
		title: 'Asus T100',
		slug: 'asus_t100',
		src: 'https://inventory-photos-1.global.ssl.fastly.net/2222669/original/463641_2B8k_5IS4L.jpg.jpg?1458807055',
		price: '233',
	},
	{
		id: 14,
		title: 'Allview Viva H1001',
		slug: 'allview_h1001',
		src: 'https://s12emagst.akamaized.net/products/3382/3381347/images/res_627e90100a43e06eed621b2f1e6a5801_full.jpg',
		price: '35',
	},
];

export function getProduct(slug: string) {
	console.log('slug')
	return products.filter(e => e.slug === slug)[0];
}

export function getAllProduct() {
	return products;
}

export function getCategoryProducts(slug: string) {
	const id = categories.find(e => e.slug === slug).id;
	const productIds = productCategories.filter(e => e.category_id === id).map(e => e.product_id);
	return products.filter(e => productIds.indexOf(e.id) > -1);
}

export function getCategoryList(slug?: string) {
	const id = slug ? categories.find(e => e.slug === slug).id : 0;
	return categories.filter(e => e.parent === id);
}
