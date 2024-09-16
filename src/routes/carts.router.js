import { Router} from 'express';

import CartManagerMongo from '../managers/CartManagerMongo.js';
import {auth} from '../middlewere/AuthMiddlewere.js'

const router = Router();
//const productManager = new ProductManager("./products.json")
//const cartManager = new CartManager("./carts.json")
const cartManager = new CartManagerMongo()

/*
router.get('/:cid',async(req,res)=>{
    try{
        
        const {cid} = req.params
        const cartWithProducts = await cartManager.getCartByIDWithProducts(parseInt(cid))
        res.status(200).send(JSON.stringify(cartWithProducts))
    }catch(error){
        console.log(error)
    }   
})*/

router.get('/',async(req,res)=>{
    const productos =[
        {
            id:"665005d431ab6ee60bca20da",
            quantity:2
        },
        {
            id:"6651310e0dc825e9da1abbd1",
            quantity:5
        }
    ]
    try{
        //const cart =await cartManager.addCart(productos)
        //console.log(cart)
        //const cartAdded = await cartManager.addProductToCart("665a230fbb354e68fc3f0332","6651310e0dc825e9da1abbd1",200)
        //console.log(cartAdded)
        
        let cart = await cartManager.deleteAllProductsFromCart({_id:"665a230fbb354e68fc3f0332"})
        cart = await cartManager.getCartsBy({_id:"665a230fbb354e68fc3f0332"})
        //const prodct = await cartManager.deleteProductFromCart("665a230fbb354e68fc3f0332","6651310e0dc825e9da1abbd1")
        

        res.send(cart)
    }catch(error){
        console.log(error)
        res.send(error)
    }
    

})

/*
//Crea un carrito
router.post('/',async(req,res)=>{
    try{
        const productos = req.body;
        const  response= await cartManager.createCart(productos);
        console.log(productos)
        res.status(200).send(response)
    }catch(error){
        console.log(error)
    } 
})
*/
/*
//Agrega un arrary de productos al carrito
router.post('/:cid',async(req,res)=>{
    try{
        const cartID = req.params.cid
        const productos = req.body;
        const  response= await cartManager.addProductToCart(cartID,productos);
        console.log(productos)
        res.status(200).send(response)
    }catch(error){
        console.log(error)
    } 
})
*/

//Agrega un producto al carrito
router.put('/addProduct/',auth,async(req,res)=>{
    try{
        const {productId,quantity} = req.body
        if(quantity <= 0){
            res.status(400).send({
                status:"error",
                msg:"La cantidad no puede ser 0 o menor"
            })
        }
        const cartID=req.user.cart_id
        const response = await cartManager.addProductToCart(cartID,productId,quantity)
        res.status(200).send({
            status:"ok"
        })
    }catch(error){
        res.send(error)
    }
})

//Borra un producto del carrito
router.delete('/deleteProduct/:productId',auth,async(req,res)=>{
    try{
        const {productId} = req.params
        const cartID=req.user.cart_id
        let response = await cartManager.deleteProductFromCart(cartID,productId)
        res.status(200).send(response)
    }catch(error){
        //console.log(error)
        res.status(200).send(error)
    }

})

//Borra todos los productos del carrito
router.delete('/:cid', async(req,res)=>{
    try{
        const {cid,pid} = req.params
        const response = await cartManager.deleteProductFromCart(cid,pid)
        res.status(200).send(response)
    }catch(error){
        res.status(200).send(error)
    }
})

router.get('/getCart/',auth,async(req,res)=>{
    try{
        const cartID=req.user.cart_id
        const cart = await cartManager.getCartWithProducts(cartID)
        if(!cart){
            throw({
                status:"error",
                message:"no existe el carrito"
            })
        }
        res.status(200).send(cart)
    }catch(error){
        res.send({
            status:"error",
            msg:error.message
        })
    }

})

export default router