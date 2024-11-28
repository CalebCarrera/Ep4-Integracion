const express = require('express');
const router = express.Router();
const clienteController = require('../controller/clientesController');

router.post('/cliente/crear', clienteController.crearCliente);

router.get('/cliente/:id/detalle', clienteController.obtenerCliente);

router.put('/cliente/:id/actualizar', clienteController.actualizarCliente);

router.delete('/cliente/:id/eliminar', clienteController.eliminarCliente);

module.exports = router;
