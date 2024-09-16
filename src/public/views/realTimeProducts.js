const socketClient = io();
let prev;
let next;
let isEditing = false;
socketClient.on("darProductosUnaVez",(productos)=>{
  console.log(productos)
  renderProductList(productos)
})

socketClient.on("mensajeStatus",(respuesta)=>{
  alert(respuesta.msg)
})

socketClient.on("actualizacionProductos",(productos)=>{
  renderProductList(productos)
})
///////////////////////////////////////////////////////////////////////////////////

// Función para renderizar la lista de productos
function renderProductList(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '<h2>Productos Existentes</h2>'; // Limpiar y agregar el encabezado

  // Mostrar los productos paginados
  products.docs.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.innerHTML = `
      <div>
        <strong>${product.title}</strong> - ${product.description} - Precio: $${product.price} - Stock: ${product.stock} - Categoría: ${product.category}
      </div>
      <button class="btn-modify">Modificar</button>
      <button class="btn-delete">Borrar</button>
    `;

    // Botón de modificar
    productItem.querySelector('.btn-modify').addEventListener('click', () => {
      fillFormForEdit(product);
    });

    // Botón de borrar
    productItem.querySelector('.btn-delete').addEventListener('click', () => {
      deleteProduct(product);
      clearForm();
    });

    productList.appendChild(productItem);
  });


  // Habilitar o deshabilitar los botones de paginación según la página actual
  document.getElementById('prev-page').disabled = !products.hasPrevPage;
  document.getElementById('next-page').disabled = !products.hasNextPage;

  //Seteo las variables para el eventListener
  this.prev = products.prevPage
  this.next = products.nextPage


    // Verificar si ya tiene el listener, de lo contrario agregarlo
  if (!document.getElementById('next-page').hasListener) {
    document.getElementById('next-page').addEventListener('click', () => {
      socketClient.emit("buscarPaginaProductos",this.next );
    });
    document.getElementById('next-page').hasListener = true; // Marcamos que ya tiene un listener
  }

  // Verificar si ya tiene el listener, de lo contrario agregarlo
  if (!document.getElementById('prev-page').hasListener) {
    document.getElementById('prev-page').addEventListener('click', () => {
      socketClient.emit("buscarPaginaProductos",this.prev)
    });
    document.getElementById('prev-page').hasListener = true; // Marcamos que ya tiene un listener
  }


}
// Función para llenar el formulario con los datos del producto a modificar
function fillFormForEdit(product) {
  document.getElementById('product-id').value = product._id;
  document.getElementById('code').value = product.code;
  document.getElementById('title').value = product.title;
  document.getElementById('description').value = product.description;
  document.getElementById('price').value = product.price;
  document.getElementById('thumbnail').value = product.thumbnail;
  document.getElementById('stock').value = product.stock;
  document.getElementById('available').value = product.status;
  document.getElementById('category').value = product.category;
  isEditing = true; // Activar modo edición
  document.getElementById('btn-cancel-modify').style.display = 'block';
}

// Función para eliminar un producto
function deleteProduct(product) {
  socketClient.emit("borrarProducto",(product._id))
}

// Función para manejar el envío del formulario
document.getElementById('product-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar el comportamiento por defecto

  let productData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    thumbnail: document.getElementById('thumbnail').value,
    code: document.getElementById('code').value,
    category: document.getElementById('category').value,
    status:document.getElementById('available').value
  };
  if (isEditing) {
    // Actualizar producto existente
    isEditing = false; // Desactivar modo edición
    //Tomo el id proque para editar lo preciso para buscarlo
    id= document.getElementById('product-id').value
    productData ={
        _id:id,
      ...productData
    }
    socketClient.emit("actualizarProducto",productData)
    document.getElementById('btn-cancel-modify').style.display = 'none';

  } else {
    // Añadir nuevo producto
    socketClient.emit("agregarProducto",productData)
  }
  clearForm()
});

document.getElementById('btn-cancel-modify').addEventListener('click', (event) => {
  isEditing = false
  event.target.style.display = 'none'; 
  clearForm();
});

function clearForm(){
    // Limpiar el formulario
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
}
