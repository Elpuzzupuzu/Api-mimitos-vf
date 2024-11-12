const cartService = require('../services/cartService');
const productService = require('../services/productService');

exports.getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await cartService.getCartByUserId(userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCart = async (req, res) => {
    try {
        const cart = await cartService.createCart(req.body);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.purchaseCart = async (req, res) => {
    const { id_user, productosEnCarrito } = req.body; // Obtener id_user y productosEnCarrito del cuerpo de la solicitud

    try {
        // Procesar cada producto en el carrito
        for (const producto of productosEnCarrito) {
            // Obtener el producto por ID
            const product = await productService.getProductById(producto.id_product);
            
            if (!product) {
                return res.status(404).json({ error: `Producto con ID ${producto.id_product} no encontrado` });
            }

            // Verificar que hay suficiente stock
            if (producto.sold > product.stock) {
                return res.status(400).json({ 
                    error: `No se pudo procesar la compra: no hay suficiente stock para el producto ${product.name} (ID: ${producto.id_product})` 
                });
            }
        }

        // Si todos los productos tienen suficiente stock, proceder con la actualización y la compra
        for (const producto of productosEnCarrito) {
            // Actualizar el stock y el contador de vendidos para cada producto
            await productService.updateProductStock(producto.id_product, producto.sold);
        }

        // Crear un nuevo carrito con los productos comprados
        const cartData = {
            id_user: id_user, // Asignar el id_user
            product_list: productosEnCarrito // Los productos comprados se asignan al campo product_list
        };

        // Registrar el nuevo carrito con los productos comprados
        const newCart = await cartService.createCart(cartData);

        // Vaciar el carrito antiguo después de la compra
        // await cartService.emptyCart(id_user); <--- este era el error

        // Responder con éxito
        res.status(200).json({
            message: 'Compra realizada con éxito',
            newCart // Devolver el nuevo carrito con los productos comprados
        });
    } catch (error) {
        console.error(error);  // Mostrar el error completo en el log para depuración
        res.status(500).json({ error: error.message });
    }
};





// testing

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.status(200).json(carts); // Devolver todos los carritos
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


