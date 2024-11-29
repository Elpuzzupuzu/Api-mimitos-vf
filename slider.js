

const clevercloud= 'https://mimitos.onrender.com';
const milocal='http://localhost:3000';




document.addEventListener('DOMContentLoaded', function () {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    let currentPage = 1;
    const pageSize = 5;
    const numerito = document.getElementById('numerito');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const productsContainer = document.getElementById('products-container');
    const slider = document.getElementById('product-slider');
    actualizarNumerito();

    if (!numerito || !prevBtn || !nextBtn || !productsContainer || !slider) {
        console.error('Algunos elementos del DOM no se encontraron.');
        return;
    }

    // Función para obtener productos de una página desde el backend o localStorage
    async function fetchProducts(page) {
        // Verificar si los productos de esta página están en localStorage
        const cachedProducts = JSON.parse(localStorage.getItem(`productos-pagina-${page}`));
        if (cachedProducts) {
            console.log(`Cargando productos de la página ${page} desde localStorage`);
            renderProducts(cachedProducts.products);
            manejarBotonesPaginacion(cachedProducts.totalPages);
            return;
        }

        // Si no están en localStorage, obtenerlos del backend
        try {
            console.log(`Cargando productos de la página ${page} desde el backend`);
            const response = await fetch(`${clevercloud}/api/products/slider?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) throw new Error('Error al obtener los productos');
            const data = await response.json();

            // Guardar los productos en localStorage para la página actual
            localStorage.setItem(`productos-pagina-${page}`, JSON.stringify(data));
            renderProducts(data.products);
            manejarBotonesPaginacion(data.totalPages);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    // Renderizar los productos en el slider
    function renderProducts(products) {
        slider.innerHTML = '';

        if (!products || products.length === 0) {
            slider.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <div class="card-product">
                    <div class="container-img">
                        <img src="${product.img}" alt="Producto">
                        <span class="discount">-13%</span>
                        <div class="button-group">
                            <span class="view-details" data-product-id="${product.id_product}">
                                <i class="fa-solid fa-eye"></i>
                            </span>
                            <span><i class="fa-regular fa-heart"></i></span>
                            <span><i class="fa-solid fa-code-compare"></i></span>
                        </div>
                    </div>
                    <div class="content-card-product">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <h3>${product.name}</h3>
                        <button class="add-cart" id="${product.id_product}">
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>
                        <button class="play-description" id="play-${product.id_product}">
                            <i class="fa-solid fa-volume-high"></i> Escuchar descripción
                        </button>
                        <p class="price">$${product.price} <span></span></p>
                        <br>
                        <p class="stock">${product.stock} en stock</p>
                    </div>
                </div>
            `;

            slider.appendChild(productDiv);

            // Eventos para acciones del producto
            productDiv.querySelector('.add-cart').addEventListener('click', () => agregarAlCarrito(product.id_product));
            productDiv.querySelector(`#play-${product.id_product}`).addEventListener('click', () => reproducirDescripcion(product.description));
            productDiv.querySelector('.view-details').addEventListener('click', () => {
                window.location.href = `producto.html?productId=${product.id_product}`;
            });
        });
    }

    // Manejar botones de paginación
    function manejarBotonesPaginacion(totalPages) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    // Función para agregar al carrito
    function agregarAlCarrito(productId) {
        const cachedProducts = JSON.parse(localStorage.getItem(`productos-pagina-${currentPage}`));
        const productoAgregado = cachedProducts.products.find(product => product.id_product === productId);

        if (productoAgregado) {
            const productoEnCarrito = productosEnCarrito.find(product => product.id_product === productId);

            if (productoEnCarrito) {
                productoEnCarrito.sold++;
            } else {
                productoAgregado.sold = 1;
                productosEnCarrito.push(productoAgregado);
            }

            saveLocalCarrito();
            actualizarNumerito();
        } else {
            console.error(`Producto con ID ${productId} no encontrado`);
        }
    }

    // Guardar el carrito en localStorage
    const saveLocalCarrito = () => {
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    };

    // Actualizar el número de productos en el carrito
    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.sold, 0);
        numerito.innerText = nuevoNumerito;
    }

    // Botones de paginación
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentPage);
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        fetchProducts(currentPage);
    });

    // Cargar la primera página al inicio
    fetchProducts(currentPage);
});


//holllaaaa