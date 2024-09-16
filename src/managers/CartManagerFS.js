import fs, { stat } from 'fs';
import ProductManager from './ProductManagerFS.js';

class CartManager{
   
    constructor(path){
        this.path=path
        this.productManager = new ProductManager("./products.json")
    }


    async createCart(cartParam) {
        if (Array.isArray(cartParam)) {
          const cart = [];
          
          for (const producto of cartParam) {
            //console.log(producto.idProduct)
            const product = await this.productManager.getProductByID(parseInt(producto.idProduct));
            console.log(product)
            // Si no es una string es porque el producto existe
            if (typeof product !== 'string') {
              const productCart = {
                "idProduct": producto.idProduct,
                "count": producto.count
              };
              cart.push(productCart);
            }
          }
      
          const cartToSave = {
            id: await this.#getMaxId() + 1,
            products: cart
          };
      
          try {
            let allCarts = await this.getAllCarts()
            allCarts.push(cartToSave);
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts));
            return "Carrito agregado";
          } catch (error) {
            console.log(error);
          }
        }
        return "Carrito Sin productos"
      }
        
     //Devuelve un array de productos
     async getAllCarts(){
        try {
            if(fs.existsSync(this.path)){
               let carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
               return carts
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }

    async #getMaxId(){
        let maxId = 0;
        let allCarts = await this.getAllCarts()
        allCarts.map((cart) =>{
            if(cart.id > maxId) maxId = cart.id;
        })
        return maxId;
    }

    async addProductToCart(idCart,idProduct,quantity){
        try{
            
            const cartById = await this.getCartByID(parseInt(idCart));
           // console.log(cartById)
            const allCarts = await this.getAllCarts()
            //console.log(allCarts)
            const index = allCarts.findIndex(cart => cart.id === parseInt(idCart));
           
            let itemExists = false
            
            const productById = await this.productManager.getProductByID(parseInt(idProduct))
            //console.log(productById)
            //El metodo getProductByID devuelve un mensaje de error si no encuentra el producto, por eso lo comparo con string
            if(typeof productById !=='string'){

                for(const key in cartById.products){
                    console.log(cartById.products[key].idProduct)
                    
                    if(parseInt(cartById.products[key].idProduct) === parseInt(idProduct)){
                        cartById.products[key].count=parseInt(cartById.products[key].count)+parseInt(quantity)
                        console.log(cartById.products[key].count)
                        itemExists=true
                    }
                }
                if(!itemExists){
                    const productCart = {
                        "idProduct": idProduct,
                        "count": 1
                      };
                    cartById.products.push(productCart)
                }
                allCarts[index]=cartById
                await fs.promises.writeFile(this.path, JSON.stringify(allCarts));

                return "producto agregado al carrito"
            }else{
                return "el producto no existe"
            }
            /*for(prod in products){
                for(const key in cartById){
                    itemInCart = cartById[key]
                    if(itemInCart.idProduct === prod.idProduct){
                        cartById[key].count = cartById[key].count+1
                    }else{
                        cartById.push(prod)
                    }
                } 
            }*/
            
        }catch(error){
            return "error"
        }
    }


    #productExistsInCart(cart,product){
        for(const item in cart){
            if(item.idProduct === product.idProduct){
                return true
            }else{
                return false
            }
        } 
    }


    async getCartByID(idCart){
        let allCart = await this.getAllCarts()
        let cart = allCart.find(cart => cart.id===idCart)
        if(cart){
            return cart
        }else{
            return "no existe carrito con ese id"
        }
    }

    async getCartByIDWithProducts(idCart){
        try{
            let allCarts = await this.getCartByID(parseInt(idCart))
            let cartWithProducts = []
            if (typeof product !== 'string') {
                cartWithProducts.push({"idCart":idCart})
                for (const key in allCarts.products){
                    let prod =  await this.productManager.getProductByID(parseInt(allCarts.products[key].idProduct))
                    cartWithProducts.push(prod)
                }
            }
            return cartWithProducts
        }catch(error){
            return "error"
        }
    }

}

export default CartManager