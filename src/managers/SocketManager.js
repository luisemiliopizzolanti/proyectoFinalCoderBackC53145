import { validateProduct } from "../utils.js"
import ProductManagerMongo from "./ProductManagerMongo.js"

const socketManager = async(socketServer)=>{
    socketServer.on('connection',async (socket)=>{
        const productsManager =new ProductManagerMongo()
        try{
           
            const products= await productsManager.getProductPaginateBy(undefined,process.env.REAL_TIME_PRODUCTS_PER_PAGE)
            socket.emit("darProductosUnaVez", products)
        }catch(error){
            console.log(error)
            socket.emit("darProductosUnaVez", "error")
        }

        socket.on('borrarProducto',async (productID)=>{
            try{
                const res = await productsManager.deleteProduct({_id:productID})
                //Si devulve el producto eliminado, es porque lo borro
                if(res){
                    socket.emit("mensajeStatus",
                        {
                         status:"ok",
                         msg:"Producto borrado con exito"
                       })
                }
                const todosProductos = await productsManager.getProductPaginateBy(undefined,process.env.REAL_TIME_PRODUCTS_PER_PAGE)
                socketServer.emit("actualizacionProductos",todosProductos)
            }catch(error){
                socket.emit("mensajeStatus",error)
            }   
        })

        socket.on("agregarProducto",async(producto)=>{
            try{
               producto.status=Boolean(producto.status)
               validateProduct(producto)
               const res = await productsManager.addProduct(producto)
               if(res){
                    const todosProductos = await productsManager.getProductPaginateBy(undefined,process.env.REAL_TIME_PRODUCTS_PER_PAGE)
                    //Actualizar los productos en todos lados
                    socketServer.emit("actualizacionProductos",todosProductos)
               }
               socket.emit("mensajeStatus",
                {
                 status:"ok",
                 msg:"Producto agregado con exito"
               })
            }catch(error){
                console.log(error)
                socket.emit("mensajeStatus",error)
            }
        })

        socket.on("buscarPaginaProductos",async(pagina)=>{
            try{
                const todosProductos = await productsManager.getProductPaginateBy(undefined,process.env.REAL_TIME_PRODUCTS_PER_PAGE,pagina)
                socket.emit("actualizacionProductos",todosProductos)
            }catch(error){
                socket.emit("mensajeStatus",error)
            }
        })

        socket.on("actualizarProducto",async(product)=>{
            try{
                product.status=Boolean(product.status)
               //console.log(product)
                validateProduct(product)
                const updatedProduct = await productsManager.updateProduct(product)
                console.log(updatedProduct)
                socket.emit("mensajeStatus",
                    {
                     status:"ok",
                     msg:"Producto actualizado con exito"
                   })
                const todosProductos = await productsManager.getProductPaginateBy(undefined, process.env.REAL_TIME_PRODUCTS_PER_PAGE)
                socket.emit("actualizacionProductos",todosProductos)
            }catch(error){
                console.log(error)
                socket.emit("mensajeStatus",error)
            }
        })
    })

    
}
export default socketManager

    