const express = require('express');
const router = express.Router();
const meseroController = require('../controller/meseroController');
const verifyToken = require('../config/verifytoken');

router.post('/mesero/crear', meseroController.crearMesero);
router.post('/mesero/login', meseroController.validarMesero);
router.get('/mesero', verifyToken, meseroController.obtenerMesero);
router.put('/mesero/:id/actualizar', verifyToken, meseroController.actualizarMesero);
router.delete('/mesero/:id/eliminar', verifyToken, meseroController.eliminarMesero);

module.exports = router;