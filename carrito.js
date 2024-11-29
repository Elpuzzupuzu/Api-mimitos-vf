// Obtener el carrito de la compra actual
const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Contenedores y elementos de UI
localStorage.setItem('id_user', '2250');

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

// Cargar productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.img}" alt="${producto.name}">
                <div class="carrito-producto-titulo">
                    <small>Producto</small>
                    <h3>${producto.name}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.sold}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>${producto.price}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${(producto.price * producto.sold).toFixed(2)}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id_product}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            `;
            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Función para actualizar los botones de eliminar
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id); // Convertir el id a entero si es necesario
    const index = productosEnCarrito.findIndex(producto => producto.id_product === idBoton);

    productosEnCarrito.splice(index, 1);
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

// Botón para vaciar el carrito
botonVaciar.addEventListener("click", () => {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
});

// Función para actualizar el total
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.price * producto.sold), 0);
    contenedorTotal.innerText = `$${totalCalculado.toFixed(2)}`;
}

// Función para manejar la compra
async function comprarCarrito() {
    const userId = localStorage.getItem("id_user"); // Obtener el id_user desde localStorage

    if (!userId) {
        Swal.fire({
            icon: 'warning',
            title: 'No se encontró el ID de usuario',
            text: 'Inicia sesión para continuar.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(`https://api-bikelike-vf.onrender.com/api/cart/compra/test`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_user: userId,
                productosEnCarrito: productosEnCarrito
            })
        });

        if (response.ok) {
            localStorage.removeItem("productos-en-carrito");
            cargarProductosCarrito();

            Swal.fire({
                icon: 'success',
                title: 'Compra realizada con éxito',
                showConfirmButton: false,
                timer: 2000
            });

            // Vaciar el carrito
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Actualizar la UI
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.remove("disabled");

            // Invalidar la caché de productos y recargar la página actual
            invalidarCacheProductos();
            fetchProducts(currentPage);

        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error al realizar la compra',
                text: errorData.error,
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: error.message,
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para invalidar la caché de productos
function invalidarCacheProductos() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('productos-pagina-')) {
            localStorage.removeItem(key);
        }
    });
}

// Función para obtener productos (dummy)
function fetchProducts(page) {
    console.log(`Recargando productos para la página: ${page}`);
    // Aquí deberías implementar la lógica para solicitar los productos actualizados al backend
}

// Variable de página actual (dummy)
const currentPage = 1;

// Asignar la función al botón de comprar
botonComprar.addEventListener("click", comprarCarrito);

// Cargar productos al iniciar
cargarProductosCarrito();


