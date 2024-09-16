import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    // Obtener el token de las cookies
   // console.log(req.cookies)
    let token = req.cookies.token;
    if (!token) {
        return res.status(401).json(
            {
                status:"error",
                msg: 'Hay que logearse primero'
            }
        );
    }
    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD);
         // Guardar los datos decodificados en req.user
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(
            {   
                status:"error",
                msg: "No autorizado" 
            }
        );
    }
};