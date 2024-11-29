const Product = require('../models/Product');

exports.getAllProducts = async () => {
    return await Product.findAll();
};




exports.getProductById = async (productId) => {
    return await Product.findByPk(productId);
};




exports.getallLimitEditionProducts = async () => {
    try {
        // Realiza la consulta a la base de datos para obtener productos con edición limitada
        const products = await Product.findAll({
            where: {
                limit_edition: true
            }
        });

        // Verifica si se encontraron productos
        if (!products || products.length === 0) {
            // Lanza un error si no se encuentran productos
            throw new Error('No se encontraron productos de edición limitada.');
        }

        // Devuelve los productos encontrados
        return products;
    } catch (error) {
        // Manejo del error: log y mensaje
        console.error("Error al obtener productos de edición limitada:", error.message);
        throw new Error('Error al obtener productos de edición limitada: ' + error.message);
    }
};





exports.createProduct = async (data) => {
    return await Product.create(data);  // Asegúrate de que 'data' incluya 'img'
};



exports.getProductById = async (productId) => {
    return await Product.findByPk(productId);
};



// Actualiza un producto por su ID
exports.updateProduct = async (productId, updatedData) => {
    try {
        // Buscar el producto por su ID
        const product = await Product.findByPk(productId);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Excluir campos que no se deben actualizar (en este caso el id)
        const { id, ...fieldsToUpdate } = updatedData;

        // Actualizar los campos proporcionados
        await product.update(fieldsToUpdate);

        // Devolver el producto actualizado
        return product;
    } catch (error) {
        // Manejo de errores
        throw error;
    }
};











exports.getProductsForSlider = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;  // Calcula el offset para la paginación
    const limit = pageSize;

    const { rows: products, count: totalItems } = await Product.findAndCountAll({
        offset,
        limit
    });

    return {
        products,  // Productos de la página actual
        totalItems,  // Número total de productos
        totalPages: Math.ceil(totalItems / pageSize),  // Total de páginas
        currentPage: page  // Página actual
    };
};



exports.getLimitEditionProducts = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;  // Calcula el offset para la paginación
    const limit = pageSize;

    const { rows: products, count: totalItems } = await Product.findAndCountAll({
        where: {
            limit_edition: true  // Filtra solo los productos con limit_edition en true
        },
        offset,
        limit
    });

    return {
        products,  // Productos de la página actual
        totalItems,  // Número total de productos
        totalPages: Math.ceil(totalItems / pageSize),  // Total de páginas
        currentPage: page  // Página actual
    };
};








///------------------------------------------/////




// testing 

// En productService.js  YA ESTA LISTO 

exports.updateProductStock = async (productId, quantity) => {
    const product = await Product.findByPk(productId);
    if (product) {
        product.stock -= quantity; // Disminuir el stock
        product.sold += quantity; // Aumentar el contador de vendidos
        return await product.save(); // Guardar los cambios en la base de datos
    }
    throw new Error('Producto no encontrado');
};

