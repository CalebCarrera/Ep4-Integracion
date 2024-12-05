const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/categoriaController');

router.post('/categoria/crear', categoriaController.crearCategoria);
router.get('/categoria', categoriaController.obtenerCategoria);
router.put('/categoria/:id/actualizar', categoriaController.actualizarCategoria);
router.delete('/categoria/:id/eliminar', categoriaController.eliminarCategoria);

module.exports = router;