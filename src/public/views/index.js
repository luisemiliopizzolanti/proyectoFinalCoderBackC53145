const socketClient = io();

socketClient.on("darProductosUnaVez",(productsArray)=>{
  let infoProducts = '';
    productsArray.forEach(product=>{
        infoProducts += `<p> ${product.title} - Descripcion: ${product.description} - Stock: ${product.stock}  - $${product.price}</p>`
    })
    products.innerHTML = infoProducts
})


        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.add-to-cart');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    alert('Producto agregado al carrito: ' + productId);
                    
                });
            });
        });