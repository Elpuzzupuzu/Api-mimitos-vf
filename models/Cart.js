const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Cart = sequelize.define('Cart', {
    id_cart: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id_user'
        }
    },
    product_list: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'carts',  // Especifica que la tabla en la base de datos se llama 'carts'
    timestamps: false
});

Cart.belongsTo(User, { foreignKey: 'id_user' });

module.exports = Cart;
