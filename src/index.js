// const fs = require('fs');
// let rawdata = fs.readFileSync('./data/products.json');
// let productCatalogue = JSON.parse(rawdata);
var productCatalogue = require("./data/products.json")
const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

// const exemplo1Mock = {
// 	products: [
// 		{ name: 'DISNEY CRUELLA© T-SHIRT', category: 'T-SHIRTS' },
// 		{ name: 'KNIT JOGGING PANTS', category: 'PANTS' },
// 		{ name: 'ASYMMETRICAL LEATHER SLIDE HEELS', category: 'SHOES' },
// 		{ name: 'SOFT FLAP BACKPACK', category: 'BAGS' }
// 	],
// 	promotion: 'FULL LOOK',
// 	totalPrice: '404.96',
// 	discountValue: '75.00',
// 	discount: '15.63%'
// };

//TODO : Isolate the functions and call them inside the main method, i need to check with Ricardo which is the best way to encapsulate the method.

function getShoppingCart(ids, productsList) {
	
	const cart = {}	
	let selectedProducts = []
	let products = []
	let categories = []
	let selectedPromotion = '';
	let discountValue = 0;
	let discount;
	let formatedDiscount = '';

	

	// Adds the chosen items to the cart, verifies which is the selected promotion considering the number of chosen categories.
	ids.map( (productId) => {
		const product = {}
		const selectedProduct = productCatalogue.products.find( element => element.id === productId  )
		// Recives the selected product. That will be usefull to calculate the totalPrice considering the promotion type, avoiding another consult to the complete productCatalogue;
		selectedProducts.push(selectedProduct);

		product.name = selectedProduct.name;
		product.category = selectedProduct.category;
		products.push(product)	

		
		// Checks if a category is already selected, if isn't , the category will be added to the category array
		if(!categories.find( cat => selectedProduct.category === cat)) {
			categories.push(selectedProduct.category)
		}
	})
	
	// Defines the product's promotional category
	switch(categories.length) {
		case 1:
			selectedPromotion = promotions[0];
			break;
		case 2:
			selectedPromotion = promotions[1];
			break;
		case 3:
			selectedPromotion = promotions[2];
			break;
		case 4:
		selectedPromotion = promotions[3];
		break;	
	}
	
	// Lets recive the final value considering the promotionalCategory
	let finalPrice = selectedProducts.reduce ((accumulator, currentProduct) => {
			
			const promotionalTag = currentProduct.promotions.find( promotion => promotion.looks.includes(selectedPromotion))
			// console.log('produto enquadrado',promotionalTag)
			if (promotionalTag) {
				accumulator += promotionalTag.price;
				discountValue += currentProduct.regularPrice - promotionalTag.price;

			} else {
				accumulator += currentProduct.regularPrice;
			}	
		return accumulator;
	},0)
	
	discount =  1 - (finalPrice / ( finalPrice + discountValue));
	formatedDiscount = `${(discount*100).toFixed(2)}%`
	
	
	//montando o pedido com os dados
	cart.products = products;
	cart.promotion = selectedPromotion;
	cart.totalPrice = finalPrice.toFixed(2);
	cart.discountValue = discountValue.toFixed(2);
	cart.discount = formatedDiscount;


	
	return cart;
}

 getShoppingCart([120,230,310,490])
// getShoppingCart([120])

module.exports = { getShoppingCart };
