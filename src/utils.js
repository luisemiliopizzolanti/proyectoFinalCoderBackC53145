import { dirname } from "path";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';


export const __dirname = dirname(fileURLToPath(import.meta.url));
export const validateProduct = (productParam)=>{

    const {title, description,price,thumbnail,code,stock,category,status} = productParam
        if(!title){
            throw {
                status:"error",
                msg:"Falta titulo"
            }
        } 
        if(!description){
            throw {
                status:"error",
                msg:"Falta descripcion"
            }
        } 
        if(!price){
            throw {
                status:"error",
                msg:"Falta precio"
            }
        } 
        if(!Number.isInteger(price)){
           throw {
                status:"error",
                msg:"precio no es un numero"
            }
        }
        if(!thumbnail){
            throw {
                status:"error",
                msg:"Falta imagenes"
            }
        }
        if(!code){
            throw {
                status:"error",
                msg:"Falta codigo"
            }
        }
        if(!stock){
            throw {
                status:"error",
                msg:"Falta stock"
            }
        }
        if(!Number.isInteger(stock)){
            throw {
                status:"error",
                msg:"Stock no es un numero"
            }
        } 
        if(!category){
            throw {
                status:"error",
                msg:"Falta categoria"
            }
        }
         if(typeof status !== "boolean"){
            throw {
                status:"error",
                msg:"Falta status"
            }
        }
}

export const getBaseURL = (req)=>{

    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}`;
    return fullUrl
}

export const generateToken = (user) => {
    
    return jwt.sign(
      {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cart_id:user.cart_id
      },
      process.env.JWT_SECRET_WORD,
      { expiresIn: '1h' }
    );
  };