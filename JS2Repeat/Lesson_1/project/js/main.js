 const API = 'https://raw.githubusercontent.com/mucholocobbb/API-s/master/ForGeekBrains'

 class List {
     constructor(url, container, list = listContext) {
         this.container = container;
         this.url = url;
         this.list = list;
         this._goods = [];
         this._allProducts = [];
         this.filtered = [];
         this._init();
     }

     getJson(url) {
         return fetch(url ? url : `${API + this.url}`)
             .then((result) => result.json())
             .catch((err) => {
                 console.log(err);
             });
     }
     handleData(data) {
         this._goods = [...data];
         this.render();
     }

     calcSum() {
         return this._allProducts.reduce((accum, item) => accum + item.price, 0);
     }
     render() {
         const block = document.querySelector(this.container);
         this._goods.forEach((product => {
             const productObj = new this.list[this.constructor.name](product);
             this._allProducts.push(productObj);
             block.insertAdjacentHTML('afterbegin', productObj.render());
         }));
     }
     filter(value) {
         const regexp = new RegExp(value, 'i');
         this.filtered = this._allProducts.filter(product => regexp.test(product.product_name));
         this._allProducts.forEach(el => {
             const block = document.querySelector(`.product__item[data-id="${el.id_product}"]`);
             if (!this.filtered.includes(el)) {
                 block.classList.add('invisible');
             } else {
                 block.classList.remove('invisible');
             }
         });

     }
     _init() {
         return false
     }
 }

 class Item {
     constructor(product, img = "http://placehold.it/200x150") {
         this.id_product = product.id_product;
         this.product_name = product.product_name;
         this.price = product.price;
         this.img = img;
     }
     render() {
         return ``;
     }
 }

 class ProductsList extends List {
     constructor(cart, container = '.product', url = "/catalogData.json") {
         super(url, container);
         this.cart = cart;
         this.getJson()
             .then(data => this.handleData(data));

     }

     _init() {
         document.querySelector(this.container).addEventListener('click', e => {
             if (e.target.classList.contains('product__item_buyBtn')) {
                 this.cart.addProduct(e.target);
             };
         });
         document.querySelector('.top__searchForm').addEventListener('input', e => {
             e.preventDefault();
             this.filter(document.querySelector('.top__searchInput').value)
         })
     }
 }

 class ProductItem extends Item {


     render() {
         return `<div class="product__item" data-id="${this.id_product}">
                    <div class="product__item_img">
                        <img src="${this.img}" alt="itemImg">
                    </div>
                    <div class="product__item_desc">
                        <h3>${this.product_name}</h3>
                        <p>${this.price} &#8381;</p>
                        <button class="product__item_buyBtn"
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-price="${this.price}">Добавить в корзину</button>
                    </div>
                </div>`;
     }
 }

 class Cart extends List {
     constructor(container = '.cart__block', url = "/getBasket.json") {
         super(url, container);
         this.getJson()
             .then(data => {
                 this.handleData(data.contents);
             })
     }
     addProduct(element) {
         this.getJson(`${API}/addToBasket.json`)
             .then(data => {
                 if (data.result === 1) {
                     let productId = +element.dataset['id'];
                     let find = this._allProducts.find(product => product.id_product === productId);
                     if (find) {
                         find.quantity++;
                         this._updateCart(find);
                     } else {
                         let product = {
                             id_product: productId,
                             price: +element.dataset['price'],
                             product_name: element.dataset['name'],
                             quantity: 1
                         }
                         this._goods = [product];
                         this.render();
                     }
                 } else {
                     alert('Error !!!')
                 }
             })
     }
     removeProduct(element) {
         this.getJson(`${API}/deleteFromBasket.json`)
             .then(data => {
                 if (data.result === 1) {
                     let productId = +element.dataset['id'];
                     let find = this._allProducts.find(product => product.id_product === productId);
                     if (find.quantity > 1) {
                         find.quantity--;
                         this._updateCart(find);
                     } else {
                         this._allProducts.splice(this._allProducts.indexOf(find), 1);
                         document.querySelector(`.cart__block_item[data-id="${productId}"]`).remove();
                     }
                 } else {
                     alert('Error !!!')
                 }
             })
     }

     _updateCart(product) {
         let block = document.querySelector(`.cart__block_item[data-id="${product.id_product}"]`);
         block.querySelector('.cart__block_productQuantity').textContent = `Количество: ${product.quantity}`;
         block.querySelector('.cart__block_rightBlockPrice').textContent = `${product.quantity * product.price} rub`;
     }

     _init() {
         document.querySelector('.btn-cart').addEventListener('click', () => {
             document.querySelector(this.container).classList.toggle('invisible');
         })
         document.querySelector(this.container).addEventListener('click', e => {
             if (e.target.classList.contains('cart__block_delBtn')) {
                 this.removeProduct(e.target);
             }
         })
     }


 }

 class CartItem extends Item {
     constructor(product, img = "http://placehold.it/70x50") {
         super(product, img);
         this.quantity = product.quantity
     }

     render() {
         return `<div class="cart__block_item" data-id="${this.id_product}">
                        <div class="cart__block_product">
                        <img src="${this.img}" alt=" Some img">
                        <div class="cart__block_productDesc">
                            <p class="cart__block_productTitle">${this.product_name}</p>
                            <p class="cart__block_productQuantity">Количество: ${this.quantity}</p>
                            <p class="cart__block_productSinglePrice">${this.price} rub. за шт.</p>
                        </div>
                        <div class="cart__block_rightBlock">
                            <p class="cart__block_rightBlockPrice">Итого: ${this.quantity * this.price} rub.</p>
                            <button class="cart__block_delBtn" data-id="${this.id_product}">&times;</button>
                        </div>
                    </div>
                </div>`;
     }
 }

 const listContext = {
     ProductsList: ProductItem,
     Cart: CartItem
 };

 let cart = new Cart();
 let products = new ProductsList(cart);