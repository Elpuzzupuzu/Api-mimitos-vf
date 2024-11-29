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
    const { id_user, productosEnCarrito } = req.body;

    // Validaciones iniciales
    if (!id_user || !Array.isArray(productosEnCarrito) || productosEnCarrito.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos: se requiere id_user y productosEnCarrito' });
    }

    try {
        // Procesar productos y actualizar stock
        const updatedProducts = [];
        for (const producto of productosEnCarrito) {
            const product = await productService.getProductById(producto.id_product);

            if (!product) {
                return res.status(404).json({ error: `Producto con ID ${producto.id_product} no encontrado` });
            }

            if (producto.sold > product.stock) {
                return res.status(400).json({
                    error: `No hay suficiente stock para el producto ${product.name} (ID: ${producto.id_product})`
                });
            }

            // Actualizar stock y ventas
            await productService.updateProductStock(producto.id_product, producto.sold);
            updatedProducts.push({ id: producto.id_product, name: product.name });
        }

        // Crear un nuevo carrito con los productos comprados
        const newCart = await cartService.createCart({
            id_user: id_user,
            product_list: productosEnCarrito,
        });

        // Responder con éxito
        res.status(200).json({
            message: 'Compra realizada con éxito',
            updatedProducts, // Información sobre los productos actualizados
            newCart, // El nuevo carrito creado
        });
    } catch (error) {
        console.error('Error durante la compra:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la compra' });
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







// Controlador para obtener los carritos con sus totales

exports.getSales = async (req, res) => {
    try {
        // Llamar al servicio para obtener el monto total de todos los carritos
        const totalSales = await cartService.getSales();
        
        // Devolver la respuesta con el monto total
        res.status(200).json({ totalSales });
    } catch (error) {
        console.error('Error al obtener el monto total de las ventas:', error.message);
        res.status(500).json({ message: 'Error al obtener el monto total de las ventas' });
    }
};

