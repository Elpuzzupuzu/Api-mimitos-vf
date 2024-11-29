const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/getallsales',cartController.getAllCarts);
router.get('/:userId', cartController.getCartByUserId);
router.post('/createcart', cartController.createCart);

router.post('/compra/test', cartController.purchaseCart); // 
router.get('/ventas/todas', cartController.getSales);  // Ruta para obtener el total de las ventas es importante tener en cuenta el fetch y su estructura //



module.exports = router;
