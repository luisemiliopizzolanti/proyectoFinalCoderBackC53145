import jwt from 'jsonwebtoken';

export const UserData = (req, res, next) => {
    // Obtener el token de las cookies
   // console.log(req.cookies)
    let token = req.cookies.token;
    if (!token) {
        req.user=undefined
        next()
    }else{
        // Verificar el token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD);
        // Guardar los datos decodificados en req.user
        req.user = decoded;
        next();
    }
    
};