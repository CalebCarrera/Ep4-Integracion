const express = require('express')
const router = express.Router()
const platoController = require('../controller/platoController')

router.post('/plato/crear', platoController.crearPlato); 
router.get('/plato/:id/detalle', platoController.obtenerPlato);
router.put('/plato/:id/actualizar', platoController.actualizarPlato); 
router.delete('/plato/:id/eliminar', platoController.eliminarPlato); 



module.exports = router
