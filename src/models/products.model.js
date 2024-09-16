import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new Schema(
    {
        title:  {
            type: String,
            required: true
        }, 
        description: String,
        price:  {
            type: Number,
            required: true
        },
        thumbnail: String,
        stock:  {
            type: Number,
            required: true
        },
        code:  {
            type: String,
            unique: true, 
            required: true
        },
        category:  {
            type: String,
            required: true
        },
        status:  {
            type: Boolean,
            required: true
        }
    }
)
productsSchema.plugin(mongoosePaginate)
export const productssModel = model('products', productsSchema)
