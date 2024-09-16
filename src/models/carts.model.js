import { Schema,model } from "mongoose";

const cartSchema = new Schema({
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

//Al devolver un carrito devueleve un conjunto de productos que los trae de la coleccion products
//El comodin "/^find/" lo aplica para todos los finds
/*cartSchema.pre(/^find/, function(next) {
    this.populate('products.product')
    next()
})*/

export const cartsModel = model('carts', cartSchema)