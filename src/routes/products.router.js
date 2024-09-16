import { Router } from 'express';
import ProductManager from '../managers/ProductManagerFS.js';
import ProductManagerMongo from '../managers/ProductManagerMongo.js';
import { getBaseURL, validateProduct } from '../utils.js';


const router = Router();
//const productManager = new ProductManager("./products.json")

const productManager = new ProductManagerMongo();

/*
//Inicializa la base de datos con datos de prueba
router.get('/iniciarDatos', async(req,res)=>{
    try{
        const product1 ={
            "title":"Agua 1L",
            "description":"Agua con gas",
            "price":150,
            "thumbnail":"/rutaimagen",
            "code":"asdas",
            "stock":5,
            "category":"bebida",
            "status":true
        }
        validateProduct(product1)
        console.log(await productManager.addProduct(product1))

        res.status(200).json({mensaje:"datos de prueba altados"})
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
})

router.get('/prueba', async(req,res)=>{
    
    res.status(200).send(getFullURL(req))
})
*/
/*
Obtiene todos los productos, puede limitar la cantidad usando  un parametro
en la query ?limit para limitar la cantidad a mostrar
*/
router.get('/', async(req,res)=>{
    try{
        //obtengo los parametros que pueden venir en el query
        let limit = Number.parseInt(req.query.limit,10)
        let page = Number.parseInt(req.query.page)
        let query = req.query.query || {}
        let sort = req.query.sort || "asc"
        if(req.query.limit !== undefined && isNaN(limit)){
            res.status(400).json(
                {   status:"error",
                    msg:"Parametro limit incorrecto"
                }
            )
            return
        }
        if(req.query.page !== undefined && isNaN(page)){
            res.status(400).json(
                {
                status:"error",
                msg:"Parametro page incorrecto"
            }
            )
            return
        }
        if(sort !== undefined && sort !== "asc" && sort !== "desc"){
            res.status(400).json({
                    status:"error",
                    msg:"Parametro sort incorrecto"
                })
            return
        }

        let productsDB = await productManager.getProductPaginateBy(query,limit,page,sort)
        let products = {
            status:"success",
            payload: productsDB.docs,
            totalPages: productsDB.totalPages,
            prevPage:productsDB.prevPage,
            nextPage:  productsDB.nextPage,
            hasPrevPage: productsDB.hasPrevPage,
            hasNextPage: productsDB.hasNextPage,
            //Pregunto si hay una pagina previa para armar la URL
            prevLink:productsDB.hasPrevPage ? `${getBaseURL(req)}/products/?page=${productsDB.prevPage}&sort=${sort}&limit=${limit}`:`${null}`,
            //prevLink:productsDB.hasPrevPage ? `/products/?page=${productsDB.prevPage}&sort=${sort}&limit=${limit}`:`${null}`,
            //Misma historia para saber si hay siguiente
            nextLink:productsDB.hasNextPage ? `${getBaseURL(req)}/products/?page=${productsDB.nextPage}&sort=${sort}&limit=${limit}`:`${null}`
            //nextLink:productsDB.hasNextPage ? `/products/?page=${productsDB.nextPage}&sort=${sort}&limit=${limit}`:`${null}`
            
        }

        res.status(200).json(products);


        /*
        if(limit){
            let limitProducts = products.slice(0,limit)
            res.status(200).json(limitProducts);
        }else{
            res.status(200).json(products);
        }*/

    }catch(error){
        //console.log(error)
        res.status(500).json(
            {
                status:"error",
                msg:"error al obtener datos"
            })
    }
})

//Obtiene un producto por ID
router.get('/:id', async(req,res)=>{
    try{
        let {id} =  req.params
        res.status(200).json(await productManager.getProductBy(
            {_id:id}
        ))

    }
    catch(error){
        console.log(error)
        res.status(500).json({mensaje:"error al obtener datosss"})
    }
})

//Crea un nuevo producto
router.post('/',async(req,res)=>{
    //Obtengo datos que vienen del body (front)
    const { title,description,code,price,status,stock,category,thumbnails } = req.body;
    try{
        validateProduct(nuevoProducto)
    }catch(error){
        throw(error)
    }
    
    try{
    const nuevoProducto = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      };

    const retorno = await productManager.addProduct(nuevoProducto)
    console.log(retorno)
    res.send(retorno)
    }catch(error){
        res.status(500).json({mensaje:"error altar producto"})
    }

})

//Actualiza un producto
router.put("/:pid", async(req,res)=>{
    try {
        let {pid} =  req.params
        const productToUpdate={_id: pid,...req.body}
        validateProduct(productToUpdate)
        const productUpdate =  await productManager.updateProduct(productToUpdate)
        res.status(200).json(JSON.stringify(productUpdate))
    } catch (error) {
        res.status(500).json({mensaje:"error al actualizar producto"})
    }
})

router.delete("/:pid", async(req,res)=>{
    try {
        let {pid} =  req.params
        const response = await productManager.deleteProduct({_id:pid})
        if(response==='ok'){
            res.status(200).send("Producto borrado")
        }else{
            res.status(200).send("Producto con ese ID no encontrado")
        }
       
    } catch (error) {
        res.status(500).send(error)
    }
})


export default router;