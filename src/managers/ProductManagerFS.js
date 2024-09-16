import fs, { stat } from 'fs';

class ProductManager{
    
    constructor(path){
        this.path=path
    }

    async addProduct(productParam){
        const {title, description,price,thumbnail,code,stock,category,status} = productParam
        if(!title){
            return "Falta titulo"
        } 
        if(!description){
            return "Falta descripcion"
        } 
        if(!price){
            return "Falta precio"
        } 
        if(!thumbnail){
            return "Falta imagenes"
        }
        if(!code){
            return "Falta codigo"
        }
        if(!stock){
            return "Falta stock"
        } 
        if(!category){
            return "Falta categoria"
        }
         if(typeof status !== "boolean"){
            return "Falta status"
        }
        
        if(await this.#codeExists(code)){
            return "El codigo ya existe, no se puede agregar el producto"
        }else{
            const product = {
                id: await this.#getMaxId()+1,
                ...productParam
            }
            try{
                let allProducts = await this.getAllProducts();
                allProducts.push(product)
                console.log(allProducts)
                await fs.promises.writeFile(this.path, JSON.stringify(allProducts));
                return "Producto agregado"
            }catch(error){
                console.log(error)
            }
        }
        
    }

    async #getMaxId(){
        let maxId = 0;
        let allProducts = await this.getAllProducts()
        allProducts.map((product) =>{
            if(product.id > maxId) maxId = product.id;
        })
        return maxId;
    }

   async #codeExists(code){
        const products = await this.getAllProducts()
        console.log(products)
        const product= products.find(code => products.code===code )
        if(product===undefined){
            return false
        }else{
            return true
        }
    }

    //Devuelve un array de productos
    async getAllProducts(){
        try {
            if(fs.existsSync(this.path)){
               let products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
               return products
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getProductByID(id){
        let allProducts = await this.getAllProducts()
        let product = allProducts.find(producto => producto.id===id)
        if(product){
            return product
        }else{
            return "no existe producto con ese id"
        }
    }

    async updateProduct(productToUpdate){
        try{
            const {id} = productToUpdate
            const productById = await this.getProductByID(id)
            const allProducts = await this.getAllProducts()
            const index = allProducts.findIndex(prod => prod.id === id);
            //Actualizco los campos que cambian del producto
            for(const key in productToUpdate){
                productById[key]=productToUpdate[key]
            }
            allProducts[index]=productById
            await fs.promises.writeFile(this.path, JSON.stringify(allProducts));
            return productById
        }catch(error){
            return "error al actulizar producto"
        }
    }

    async deleteProduct(idProduct){
        try{
            const allProducts = await this.getAllProducts()
            const productById = await this.getProductByID(idProduct)
            //El metodo getProductByID devuelve un mensaje de error si no encuentra el producto, por eso lo comparo con string
            if(typeof productById !=='string'){
                const productosFiltrados = allProducts.filter(product => product.id !== idProduct)
                await fs.promises.writeFile(this.path, JSON.stringify(productosFiltrados));
                return "ok"
            }else{
                return "error"
            } 
        }catch(error){
            console.log(error)
        }
    }
}   

export default ProductManager;

