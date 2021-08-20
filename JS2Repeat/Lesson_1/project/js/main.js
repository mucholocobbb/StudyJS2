 const API = 'https://raw.githubusercontent.com/mucholocobbb/API-s/master/ForGeekBrains'



 class ProductList {
     constructor(container = '.products') {
         this.container = container;
         this._goods = [];
         this._allProducts = [];
         //  this.getRequest(`${API}/catalogData.json`)
         //      .then((data) => {
         //          this._goods = JSON.parse(data);
         //          this._render();
         //      })
         //      .catch((err) => {
         //          console.log(err);
         //      });

         this._getProducts()
             .then((data) => {
                 this._goods = [...data];
                 this._render();
             });

     }

     //  getRequest = (url) => {
     //      return new Promise((resolve, reject) => {
     //          let xhr = new XMLHttpRequest();
     //          xhr.open('GET', url, true);
     //          xhr.onreadystatechange = () => {
     //              if (xhr.readyState === 4) {
     //                  if (xhr.status === 200) {
     //                      resolve(xhr.responseText);
     //                      console.log(xhr.status);
     //                  } else {
     //                      reject('Error');
     //                  }
     //              }
     //          }
     //          xhr.send();
     //      })

     //  };

     _getProducts() {
         return fetch(`${API}/catalogData.json`)
             .then((response) => response.json())
             .catch((err) => {
                 console.log(err);
             });
     }

     getTotalPrice() {
         return this._goods.reduce((sum, {
             price
         }) => sum + price, 0);
     }

     getTotalDiscount(discount) {
         let finalPrice = this.getTotalPrice()
         return finalPrice - (finalPrice * (discount / 100));
     }

     _render() {
         const block = document.querySelector(this.container);
         this._goods.forEach((product => {
             const productObject = new ProductItem(product);
             this._allProducts.push(productObject);
             block.insertAdjacentHTML('afterbegin', productObject.render());
         }));
         document.querySelector('.mainLogo').insertAdjacentHTML('afterend', `Full price with total discount ${this.getTotalDiscount(15)} &#8381;`);

     }
 }

 class ProductItem {
     constructor(product, img = "http://placehold.it/200x150") {
         this.id = product.id_product;
         this.title = product.product_name;
         this.price = product.price;
         this.img = img;
     }

     render() {
         return `<div class="products-item" data-id="${this.id}">
                    <div class="item-img">
                        <img src="${this.img}" alt="itemImg">
                    </div>
                    <div class="desc">
                        <h3>${this.title}</h3>
                        <p>${this.price} &#8381;</p>
                        <button class="by-btn">Добавить в корзину</button>
                    </div>
                </div>`;
     }
 }

 const productList = new ProductList();