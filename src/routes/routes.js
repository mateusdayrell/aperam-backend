const express = require('express');

const router = express.Router();

const userController = require('../controllers/UserController');
const imageController = require('../controllers/ImageController');
const tokenController = require('../controllers/TokenController');

const loginRequired = require('../middlewares/loginRequired');

// TOKEN
router.post('/tokens', tokenController.store);

// USUÁRIOS
router.get('/users/', loginRequired, userController.index);
router.get('/users/:id', userController.show);
router.post('/users/', userController.store);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

// IMAGENS
router.get('/images/', imageController.index);
router.get('/images/search/:search', imageController.search);
router.post('/images/', imageController.store);
router.put('/images/:id', imageController.update);
router.delete('/images/:id', imageController.destroy);

module.exports = router;
