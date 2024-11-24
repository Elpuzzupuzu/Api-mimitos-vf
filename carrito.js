
    // Obtener el carrito de la compra actual
const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

// Contenedores y elementos de UI
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Cargar productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
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
                    <small>cantidad</small>
                    <p>${producto.sold}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>precio</small>
                    <p>${producto.price}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>subtotal</small>
                    <p>$${(producto.price * producto.sold).toFixed(2)}</p>

                </div>
                <button class="carrito-producto-eliminar" id="${producto.id_product}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

    actualizarBotonesEliminar();
    actualizarTotal();
}

// Cargar productos al iniciar
cargarProductosCarrito();

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
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Botón para vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

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
        // Aquí incluimos el id_user junto con los productos en el cuerpo de la solicitud
        const response = await fetch(`http://localhost:3000/cart/${userId}/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_user: userId,  // Incluir el id_user aquí
                productosEnCarrito: productosEnCarrito // Los productos en el carrito
            })
        });

        if (response.ok) {
            // Si la compra fue exitosa, vaciar el carrito en la interfaz
            localStorage.removeItem("productos-en-carrito");
            cargarProductosCarrito();
            contenedorCarritoComprado.classList.remove("disabled");
            contenedorCarritoAcciones.classList.add("disabled");

            Swal.fire({
                icon: 'success',
                title: 'Compra realizada con éxito',
                showConfirmButton: false,
                timer: 2000
            });

            // Limpiar el carrito después de la compra
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Actualizar la UI
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.remove("disabled");

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



// Asignar la función al botón de comprar
botonComprar.addEventListener("click", comprarCarrito);

