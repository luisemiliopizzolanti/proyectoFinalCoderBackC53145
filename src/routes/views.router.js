import { Router } from 'express';
import ProductManagerMongo from "../managers/ProductManagerMongo.js";
import CartManagerMongo from '../managers/CartManagerMongo.js';
import { auth } from '../middlewere/AuthMiddlewere.js';
import { UserData } from '../middlewere/UserDataMiddlewere.js';
const router = Router();
const prodctManagerMongo = new ProductManagerMongo();
const cartManagerMongo = new CartManagerMongo();

router.get("/",async(req,res)=>{    
    res.status(200).render("home")
})

router.get("/realTimeProducts",async(req,res)=>{
    res.status(200).render("realTimeProducts")
})


router.get("/products",UserData,async(req,res)=>{
    
    let first_name
    if(req.user){
        first_name=req.user.first_name
    }
    try{
        let {page,cartID,prodID} = req.query
        if(!page) page = 1
        if(prodID){
            if(cartID) { 
                const cart = await cartManagerMongo.addProductToCart(cartID,prodID,1)
            }else{
                const newCart = await cartManagerMongo.addCart([{id:prodID,quantity:1}])
                cartID = newCart._id.toString()
            }

        }
        
        //let data = await prodctManagerMongo.getProductPaginateBy({},5,page,"asc")
       let data={
            "cartID":cartID,
            first_name:first_name
        }
        res.status(200).render("products",data)
        //console.log(data)
    }catch(error){
        console.log(error)
    }
    })

    router.get('/cart/',auth,async(req,res)=>{

        res.status(200).render("cart")
        /*const {cid} = req.params
        try {
            const data = await cartManagerMongo.getCartsBy({_id:cid})
        // console.log(data[0])
            
            //res.send(data[0])
        } catch (error) {
            console.log(error)
        }*/

})

router.get('/login',async(req,res)=>{
    res.status(200).render("login")
})

router.get('/register',async(req,res)=>{
    res.status(200).render("register")
})




export default router