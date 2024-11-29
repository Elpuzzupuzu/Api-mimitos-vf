const Cart = require('../models/Cart');

exports.getCartByUserId = async (userId) => {
    return await Cart.findOne({ where: { id_user: userId } });
};

exports.createCart = async (data) => {
    try {
        const cart = await Cart.create(data);  // Crear el carrito con los datos proporcionados
        return cart;
    } catch (error) {
        throw new Error(`Error al crear el carrito: ${error.message}`);
    }
};

// Obtener todos los carritos
exports.getAllCarts = async () => {
    try {
        // Buscar todos los carritos en la base de datos
        const carts = await Cart.findAll();
        return carts;
    } catch (error) {
        throw new Error(`Error al obtener todos los carritos: ${error.message}`);
    }
};




// Servicio para obtener todas las ventas (carritos)
exports.getSales = async () => {
    try {
        // Obtener todos los carritos de la base de datos
        const carts = await Cart.findAll({
            raw: true,  // raw: true para obtener solo los datos sin instancias de Sequelize
        });

        // Sumar el total de todos los carritos
        const totalAmount = carts.reduce((total, cart) => {
            const productList = cart.product_list;  // Obtener el JSON de productos

            // Verificar si 'product_list' está presente y es un array
            if (productList && Array.isArray(productList)) {
                const cartTotal = productList.reduce((sum, product) => {
                    return sum + (product.sold * product.price);  // Sumar el monto de cada producto
                }, 0);
                
                // Sumar el total de este carrito al total general
                total += cartTotal;
            }
            return total;  // Devolver el total acumulado
        }, 0);

        // Redondear el monto total a 2 decimales
        return parseFloat(totalAmount.toFixed(2));  // Redondeado a 2 decimales

    } catch (error) {
        throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
};




//----------------------------------///

exports.emptyCart = async (userId) => {
    return await Cart.destroy({ where: { id_user: userId } });
};
