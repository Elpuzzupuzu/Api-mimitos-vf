document.getElementById("loadCartsButton").addEventListener("click", async () => {
    const cartsList = document.getElementById("cartsList");
    cartsList.innerHTML = ''; // Limpiar la lista antes de cargar nuevos datos

    try {
        const response = await fetch("https://api-bikelike-vf.onrender.com/cart/getallsales");
        
        if (response.ok) {
            const carts = await response.json();

            if (carts.length === 0) {
                cartsList.innerHTML = '<p>No hay carritos disponibles.</p>';
                return;
            }

            carts.forEach(cart => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <h3>Venta ID: ${cart.id_cart}</h3>
                    <p>Usuario ID: ${cart.id_user}</p>
                    <p>Productos:</p>
                    <ul>
                        ${cart.product_list.map(product => `
                            <li class="product-item">
                                <img src="${product.img}" alt="${product.name}" class="product-image" />
                                <div class="product-details">
                                    <strong>Nombre:</strong> ${product.name}<br>
                                    <strong>Cantidad Vendida:</strong> ${product.sold}<br>
                                    <strong>Precio:</strong> $${product.price.toFixed(2)}<br>
                                    <strong>Stock:</strong> ${product.stock}<br>
                                    <strong>Disponible:</strong> ${product.available ? "Sí" : "No"}<br>
                                    <strong>Marchas:</strong> ${product.gear_count}<br>
                                    <strong>ID Producto:</strong> ${product.id_product}<br>
                                    <strong>Descripción:</strong> ${product.description}<br>
                                    <strong>ID Categoría:</strong> ${product.id_category}<br>
                                    <strong>Fecha en Venta:</strong> ${new Date(product.date_on_sale).toLocaleDateString()}<br>
                                    <strong>Edición Limitada:</strong> ${product.limit_edition ? "Sí" : "No"}
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                `;
                cartsList.appendChild(cartItem);
            });
        } else {
            cartsList.innerHTML = '<p>Error al cargar los carritos.</p>';
        }
    } catch (error) {
        cartsList.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
