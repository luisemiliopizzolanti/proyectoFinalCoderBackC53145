import { Schema, model }  from "mongoose"
//import mongoosePaginate from 'mongoose-paginate-v2'

const userCollection = 'users'

const userSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        required: true
      }

})


//userSchema.plugin(mongoosePaginate)
/*
userSchema.pre(/^find/, function(next) {
    this.populate('cart_id')
    next()
})*/
export const userModel = model(userCollection, userSchema)