import { Router } from "express";
import { UserManagerMongo } from "../managers/UserManagerMongo.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils.js";
import { auth } from "../middlewere/AuthMiddlewere.js";
import { productssModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";
import CartManagerMongo from "../managers/CartManagerMongo.js";

const router = Router()
const userManager = new UserManagerMongo()
const cartManager = new CartManagerMongo();

router.get("/prueba",async(req,res)=>{
    console.log(req.cookies)
   /* const a = await cartsModel.create({
        user_id: "66da38384b1ab45cf06af5f5",
        products: [
          {
            product: "665005d431ab6ee60bca20da",
            quantity: 2
          }
        ]
      })*/

      const b = await cartsModel.findById("66df845b830d2f2b2d9ac15f")
      console.log(b)
      res.send(b)

})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await userManager.get({email:email})
        if (!user) {
            return res.status(401).json({ 
                status:"error",
                msg: 'Usuario o contraseña invalido' 
            });
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword){
            return res.status(401).json({ 
                status:"error",
                msg: 'Usuario o contraseña invalido' 
            });
        }
        user.cart_id=user.cart_id.toString()
        const token = generateToken(user)

        // Crear una cookie HttpOnly con el token JWT
        res.cookie('token', token, {
            httpOnly: true, // No accesible desde JavaScript (protege contra XSS)
        /*   secure: process.env.NODE_ENV === 'production', // Solo se envía en HTTPS en producción*/
            sameSite: 'Strict', // Protege contra ataques CSRF (no manda la cookie a otros sitios)
            maxAge: 3600000 // Duración de 1 hora
        });

        res.status(200).send({
            status:"ok",
            msg:"Login ok",
            payload: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
         }
        )
    }catch(error){
        console.log(error)
    }
})

router.post("/registerUser", async(req,res)=>{
    const {email, first_name,last_name,password} = req.body
    try{
        //Valido que vengan los datos
        if(!email || !first_name || !last_name || !password ) return res.status(401).send({status: 'error', msg: 'Faltan completar datos'})

        const user = await userManager.get({email:email})
        //Si el usuario ya esta registrado 
        if (user) {
            return res.status(400).json(
                {   status:"error",
                    msg: 'Usuario ya existe con ese email' 
            });
        }
        const passHashed = await bcrypt.hash(password, 10);
        //Creo el carrito para asociarlo al usuario, de esta manera el usuario siempre tiene un carrito
        const cartUser = await cartManager.addCart()
        const newUser = await userManager.add(
            {email:email,
            first_name:first_name,
            last_name:last_name,
            password:passHashed,
            cart_id:cartUser._id
        })
        res.status(200).send(
            {   status:"ok",
                msg:"Usuario creado",
                payload: {
                    email: newUser.email
                }
        })
    }catch(error){
        console.log(error)
    }
})


router.get("/logout", async(req,res)=>{
    res.clearCookie('token');
    res.redirect('/views/products');
})


export default router;