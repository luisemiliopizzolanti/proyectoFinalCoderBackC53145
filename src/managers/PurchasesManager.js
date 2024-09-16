import CartManagerMongo from "./CartManagerMongo.js";
import purchases from "../models/purchases.model.js";

export class PurchasesManager{
   
  constructor(){
    this.cartManager = new CartManagerMongo();
  }

  // Método para finalizar la compra
  async finalizePurchase(userId,cartID) {
    try {
      // Buscar el carrito del usuario
      const cart = await this.cartManager.getCartByID(cartID)
      if (!cart || cart.products.length === 0) {
        throw {
          status:"error",
          msg:"El carrito está vacío o no existe"

        };
      }

      // Crear un nuevo registro en el modelo Purchases con los productos del carrito
      const purchase = new purchases({
        user: userId,
        products: cart.products, // Copiar los productos del carrito
        purchaseDate: new Date() // Establecer la fecha de compra
      });

      // Guardar el registro del historial de compra
      await purchase.save();

      // Limpiar el carrito del usuario después de la compra
      this.cartManager.deleteAllProductsFromCart(cartID)
      return {
        status: 'ok',
        msg: 'Compra finalizada y registrada en el historial'
      };

    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      throw {
          status:"error",
          msg:'Error al finalizar la compra'
      };
    }
  }
}
