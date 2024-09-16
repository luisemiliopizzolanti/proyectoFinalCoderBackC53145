import { productssModel } from "../models/products.model.js";
import { validateProduct } from "../utils.js";

class ProductManagerMongo{
    
    constructor(){
        this.products = productssModel
    }

    async addProduct(productParam){
        //Busco por si hay alguno con el codigo repetido
        try{
            const product = await this.getProductBy({ code: productParam.code})
            if (product){
                throw({
                    status:"error",
                    message: "Proudcto no agregado, codigo repetido"
                })
            }
        
           return await this.products.create(productParam)
        }catch(error){
            throw({
                status:"error",
                msg:error.message
            })
        }
        
    }

    async getProductBy(filter={}, limit = 10){
        
        let products
        try{
            if(limit>0){
                products = await this.products.find(filter).limit(limit)
            }else{
                products = await this.products.find(filter)
            }
        }catch(error){
            throw({
                status:"error",
                msg:"error consulta DB"
            })
        }
        
        if(products.length===0){
           return null
        }
        return products
       
    }

    async getProductPaginateBy(filter={}, limit = 3, numPage=1, sort={}){
        try{

            if(sort==="asc") sort = { price: 1 }
            if(sort==="desc") sort = { price: -1 }
            //filter es el filtro que paso por paramentro, en caso de no pasar nada es vacio
            //el segundo parametro son las opciones del paginado
            //limit, la cantidad de registros por pagina
            //page, la pagina que quiero mostrar
            //sort, es como quiero ordenar
            return await this.products.paginate(filter, {limit, page: numPage, sort: sort, lean: true })
        }catch(error){
            throw({
                status:"error",
                msg:"error consulta DB"
            })
        }
       
    }

    async updateProduct(productToUpdate){
        try{
            const product = await this.products.findByIdAndUpdate(productToUpdate._id,productToUpdate, { new: true });
            if (!product) {
                throw({
                    status:"error",
                    msg:"producto no encontrado"
                })
            }
            return product
        }catch(error){
            throw(error)
        }
        
    }
    async deleteProduct(productToDelete){
        try{
            const product = await this.products.findByIdAndDelete(productToDelete);
            if (!product) {
                throw({
                    status:"error",
                    msg:"producto no encontrado"
                })
            }
            return product
        }catch(error){
            throw(error)
        }
        
    }

}

export default ProductManagerMongo