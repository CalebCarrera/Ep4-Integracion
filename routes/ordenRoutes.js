const express = require('express');
const router = express.Router();
const ordenController = require('../controller/ordenController');


router.post('/orden/crear', ordenController.crearOrden);
router.get('/orden/:id', ordenController.obtenerOrden);
router.put('/orden/:id/actualizar', ordenController.actualizarOrden); 
router.delete('/orden/:id/eliminar', ordenController.eliminarOrden); 

module.exports = router;
