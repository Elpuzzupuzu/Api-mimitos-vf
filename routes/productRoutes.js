const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/getall', productController.getAllProducts);
router.get('/getallLE',productController.getLimitEditionProducts);

router.post('/create', productController.createProduct);

router.put('/update-stock/:id', productController.updateProductStock);


router.get('/slider', productController.getProductsForSlider);
router.get('/limit-edition-slider',productController.getLimitEditionSlider);
router.get('/:id', productController.getProductById);  // esta ruta entra en conflicto siempre hay que tener en cuenta las rutas 







module.exports = router;
