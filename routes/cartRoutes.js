const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/getallsales',cartController.getAllCarts);
router.get('/:userId', cartController.getCartByUserId);
router.post('/createcart', cartController.createCart);

router.post('/:userId/purchase', cartController.purchaseCart); // 



module.exports = router;
