import { cartsModel } from "../models/carts.model.js";
import ProductManagerMongo from "./ProductManagerMongo.js";


export default class CartManagerMongo{
    
    constructor(){
        this.carts = cartsModel
    }


    async addCart(){
        try{
            const cart = await this.carts.create({})
            return cart
        }catch(error){
            throw({
                status:"error",
                msg:"error al crear el carrito"
            })
        }
}

    async getCartByID(cartID){
        let cartByID
        try{
           
         cartByID=await this.carts.findById(cartID)

        }catch(error){
            throw {
                status:"error",
                msg:"error consulta DB"
            }
        }
        return cartByID
    }

    async getCartWithProducts(cartID){
      let cart
      try{
        cart = await this.carts.findById(cartID).populate('products.product');
      }catch(error){
          throw {
              status:"error",
              msg:"error consulta DB"
          }
      }
      return cart
  }

    async addProductToCart(cartID,productID,quantity){
           
        const productManager = new ProductManagerMongo();
        let product;
        // Verificar si el producto existe
        try {
          product = await productManager.getProductBy({ _id: productID });
         // console.log(product)
          if (!product) {
            throw {
                status:"error",
                message:"El producto no existe"
              }
        }
        } catch (error) {
              throw {
                status:"error",
                msg:`Error al buscar el producto en la base de datos: ${error.message}`
            };
        }
      
        // Verificar si el carrito existe
        const cart = await cartsModel.findById(cartID);
        if (!cart) {
          throw {
                status:"error",
                msg:"El carrito no existe"
            }
        }

        try {
          // Buscar si el producto ya está en el carrito
          const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productID.toString());
          if (existingProductIndex > -1) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            cart.products[existingProductIndex].quantity += parseInt(quantity);
          } else {
            // Si el producto no está en el carrito, agregarlo
            cart.products.push({ product: productID, quantity:parseInt(quantity) });
          }
      
          // Guardar el carrito actualizado
          const updatedCart = await cart.save();
          return updatedCart;
      
        } catch (error) {
          throw {
            status:"error",
            msg:`Error al actualizar el carrito1: ${error.message}`};
        }
    }

    async deleteProductFromCart(cartID, productID){
        const productManager = new ProductManagerMongo();
        let product;
        
        // Verificar si el producto existe
        try {
          product = await productManager.getProductBy({ _id: productID });
          if (!product) {
            throw { status: "error", msg: "El producto no existe" }; 
          }
        } catch (error) {
          throw { status: "error", msg: `Error al buscar el producto en la base de datos: ${error.message}` }; // Lanzar el objeto de error
        }
      
        let cart;
      
        // Verificar si el carrito existe
        try {
          cart = await cartsModel.findById(cartID);
          
          if (!cart) {
            throw { 
                status: "error",
                 msg: "El carrito no existe" 
            };
          }
        } catch (error) {
            throw { 
                status: "error", 
                msg: `Error en la base de datos al buscar el carrito: ${error.message}` 
            }; 
        }
      
        // Buscar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productID.toString());
      
        if (existingProductIndex > -1) {
          // Si el producto está en el carrito, eliminarlo
          cart.products.splice(existingProductIndex, 1);
        } else {
          throw { status: "error", msg: "El producto no está en el carrito" }; 
        }
      
        // Guardar el carrito actualizado
        try {
          const updatedCart = await cart.save()
          return { status: "ok", msg: "Producto eliminado del carrito" };
        } catch (error) {
          throw { status: "error", msg: `Error al actualizar el carrito: ${error.message}` }; 
        }
      }
      
      

      async deleteAllProductsFromCart(cartID) {
        let cart; 
        try {
            // Buscar el carrito por ID
            cart = await cartsModel.findById(cartID);
        } catch (error) {
            throw {
                status: "error",
                msg: "Error en la base de datos al buscar el carrito"
            };
        }
    
        // Verificar si el carrito existe
        if (!cart) {
            throw {
                status: "error",
                msg: "El carrito no existe"
            };
        }
    
        try {
            // Eliminar todos los productos del carrito
            //cart.products.splice(0, cart.products.length);
          
            cart.products = []
            // Guardar el carrito sin productos
            await cart.save();
    
            // Retornar el mensaje de éxito
            return {
                status: "ok",
                msg: "Todos los productos eliminados del carrito"
            };
        } catch (error) {
            throw {
                status: "error",
                msg: "Error al actualizar el carrito"
            };
        }
    }


}
