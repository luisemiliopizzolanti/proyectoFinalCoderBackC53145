import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import usersRouter from './routes/users.router.js'
import purchasesRouter from './routes/purchase.router.js'
import handlebars from "express-handlebars";
import socketManager from './managers/SocketManager.js';
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import { connectDB } from './config/index.js';
import { checkDbConnection } from './middlewere/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


//import session from 'express-session';
//import { MongoDBStore } from 'connect-mongodb-session';


// Cargar variables de entorno
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine(
        {
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }   
        }
    )
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
//Middleware para verificar si hay conexion con la DB, lo dejo como global para que verifique en aca endpoint
app.use(checkDbConnection)


//Defino las rutas
app.use('/products',productsRouter)
app.use('/carts',cartsRouter)
app.use('/views',viewsRouter)
app.use('/users',usersRouter)
app.use('/purchases',purchasesRouter)


app.get('/',(req, res)=>{
    res.redirect('/views/products');
})

try {
    console.log("conectando DB")
    await connectDB();
 } catch (error) {
    console.log(error)
    console.error("Error al conectar DB")
    console.log("Servidor terminado")
    process.exit(1)
}



const httpServer = app.listen(process.env.PORT || 8080, ()=>{
    console.log('Server ok on port ' + process.env.PORT || 8080);
})


const socketServer = new Server(httpServer)
socketManager(socketServer)
