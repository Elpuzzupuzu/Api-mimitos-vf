const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// exports.getAllProducts = async (req, res) => {
//     try {
//         throw new Error("Simulated error");
//         const products = await productService.getAllProducts();
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };




exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};









exports.getLimitEditionProducts = async (req, res) => {
    try {
        // Llama al servicio para obtener los productos de edición limitada
        const products = await productService.getallLimitEditionProducts();
        
        // Si se encuentran productos, se devuelven como respuesta
        res.json(products);
    } catch (error) {
        // Si ocurre un error, se captura y se responde con el error
        if (error.message === 'No se encontraron productos de edición limitada.') {
            // En caso de que no se encuentren productos, responder con un 404
            res.status(404).json({ message: error.message });
        } else {
            // Para otros errores, responder con un 500
            res.status(500).json({ error: error.message });
        }
    }
};













/// secciones para el renderizado 

exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);  // Asegúrate de enviar el campo 'img'
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getProductsForSlider = async (req, res) => {
    try {
        // Obtener parámetros de paginación (número de página y cantidad de productos por página)
        const page = parseInt(req.query.page) || 1;  // Página actual, por defecto 1
        const pageSize = parseInt(req.query.pageSize) || 5;  // Productos por página, por defecto 5

        const products = await productService.getProductsForSlider(page, pageSize);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getLimitEditionSlider = async (req, res) => {
    try {
        // Obtener parámetros de paginación (número de página y cantidad de productos por página)
        const page = parseInt(req.query.page) || 1;  // Página actual, por defecto 1
        const pageSize = parseInt(req.query.pageSize) || 5;  // Productos por página, por defecto 5

        const products = await productService.getLimitEditionProducts(page, pageSize);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//update product


exports.updateProductStock = async (req, res) => {
    try {
        const productId = req.params.id; // Obtenemos el ID del producto desde la URL
        const { quantity } = req.body; // Obtenemos la cantidad desde el cuerpo de la solicitud

        // Validamos que la cantidad sea un número positivo
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        // Llamamos al servicio para actualizar el stock
        const updatedProduct = await productService.updateProductStock(productId, quantity);
        
        // Si el producto se actualiza correctamente, lo devolvemos como respuesta
        res.status(200).json({
            message: 'Stock actualizado correctamente',
            product: updatedProduct
        });
    } catch (error) {
        // Si ocurre algún error, lo capturamos y respondemos con un mensaje adecuado
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};
