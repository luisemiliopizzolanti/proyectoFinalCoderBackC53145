import { Schema,model } from "mongoose";

// Definir el esquema del historial de compras (Historico)
const Purchases = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo User
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product', // Referencia al modelo Product
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        }
      }
    ],
    purchaseDate: {
      type: Date,
      default: Date.now, // Fecha de la compra
    }
  });
  
  // Crear el modelo purchases
  const purchases = model('Purchases', Purchases);
  export default purchases;
