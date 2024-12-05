
const mongoose = require('mongoose');  // Agrega esta línea
const Plato = require('../model/plato');
const Orden = require('../model/orden')
const OrdenDetalle = require('../model/ordenDetalle')
const config = require('../config/global');
exports.crearOrden = async (req, res) => {
    try {
        const { numeroMesa, platillos, estado, nota } = req.body;

        if (!numeroMesa || !platillos || platillos.length === 0) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        const estadosPermitidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
        if (estado && !estadosPermitidos.includes(estado)) {
            return res.status(400).send('Estado inválido. Los estados permitidos son: pendiente, preparando, listo, entregado, cancelado.');
        }

        let totalOrden = 0;
        const detalles = [];

        for (const item of platillos) {
            const plato = await Plato.findById(item.platoId);
            if (!plato) {
                return res.status(404).send(`Plato con ID ${item.platoId} no encontrado`);
            }

            const totalPlato = item.cantidad * plato.precio;
            totalOrden += totalPlato;

            detalles.push({
                platoId: item.platoId,
                cantidad: item.cantidad,
                descripcion: plato.nombre,
                precioUnitario: plato.precio,
                total: totalPlato,
                nota: nota || ''  // Asocia la nota a cada detalle de la orden
            });
        }

        // Crear la orden con la nota general
        const nuevaOrden = new Orden({
            numeroMesa,
            platillos: detalles,
            total: totalOrden,
            estado: estado || 'pendiente',
            nota: nota || ''  // La nota general de la orden
        });

        const ordenGuardada = await nuevaOrden.save();

        // Guardar cada detalle en la colección de OrdenDetalle
        for (const detalle of detalles) {
            const nuevoDetalle = new OrdenDetalle({
                ordenId: ordenGuardada._id,
                cantidad: detalle.cantidad,
                descripcion: detalle.descripcion,
                precioUnitario: detalle.precioUnitario,
                total: detalle.total,
                nota: detalle.nota  // Guarda la nota en cada detalle
            });

            await nuevoDetalle.save();
        }

        res.status(201).send('Orden y sus detalles creados exitosamente');
    } catch (error) {
        console.error('Error al crear la orden:', error.message);
        console.error(error.stack);

        res.status(500).send('Hubo un error al crear la orden y sus detalles');
    }
};


exports.obtenerOrden = async (req, res) => {
    try {
        const { id } = req.params;

        const orden = await Orden.findById(id);
        if (!orden) {
            return res.status(404).send('Orden no encontrada');
        }

        const detalles = await OrdenDetalle.find({ ordenId: id }).populate('platoId');

        res.json({
            numeroMesa: orden.numeroMesa, 
            platillos: detalles.map(detalle => ({
                descripcion: detalle.descripcion,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                total: detalle.total,
                nota: detalle.nota
            })),
            total: orden.total 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al obtener la orden y sus detalles');
    }
};
exports.actualizarOrden = async (req, res) => {
    try {
        const { id } = req.params;
        const { numeroMesa, platillos, estado, nota } = req.body; // Se agrega 'nota' en el body

        // Verificación de campos obligatorios
        if (!numeroMesa || !platillos || platillos.length === 0) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        // Verificación del estado
        const estadosPermitidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
        if (estado && !estadosPermitidos.includes(estado)) {
            return res.status(400).send('Estado inválido. Los estados permitidos son: pendiente, preparando, listo, entregado, cancelado.');
        }

        // Buscar la orden que se desea actualizar
        const ordenExistente = await Orden.findById(id);
        if (!ordenExistente) {
            return res.status(404).send('Orden no encontrada');
        }

        let totalOrden = 0;
        const detalles = [];

        // Actualizar los detalles de la orden
        for (const item of platillos) {
            const plato = await Plato.findById(item.platoId);
            if (!plato) {
                return res.status(404).send(`Plato con ID ${item.platoId} no encontrado`);
            }
        
            // Validar que cantidad y precio sean números válidos
            if (isNaN(item.cantidad) || item.cantidad <= 0) {
                return res.status(400).send(`Cantidad inválida para el plato con ID ${item.platoId}`);
            }
        
            if (isNaN(plato.precio) || plato.precio <= 0) {
                return res.status(400).send(`Precio inválido para el plato con ID ${item.platoId}`);
            }
        
            const totalPlato = item.cantidad * plato.precio;
            
            // Verificar que el total del plato no sea NaN
            if (isNaN(totalPlato)) {
                return res.status(400).send(`El total calculado para el plato con ID ${item.platoId} es inválido`);
            }

            totalOrden += totalPlato;
        
            detalles.push({
                platoId: item.platoId, 
                cantidad: item.cantidad, 
                descripcion: plato.nombre, 
                precioUnitario: plato.precio, 
                total: totalPlato,
                nota: nota || ""  // Asegurarse de que 'nota' sea una cadena vacía si no se proporciona
            });
        }

        // Asegurarse de que el total de la orden no sea NaN antes de actualizar
        if (isNaN(totalOrden)) {
            return res.status(400).send('El total de la orden es inválido');
        }

        // Actualizar la orden con nuevos detalles, total y la nota
        ordenExistente.numeroMesa = numeroMesa;
        ordenExistente.platillos = detalles;
        ordenExistente.total = totalOrden;
        ordenExistente.estado = estado || ordenExistente.estado;  // Mantener el estado si no se pasa uno nuevo
        ordenExistente.nota = nota || "";  // Asegurar que la nota sea vacía si no se proporciona

        const ordenActualizada = await ordenExistente.save();

        // Eliminar detalles antiguos y agregar los nuevos
        await OrdenDetalle.deleteMany({ ordenId: id });

        for (const detalle of detalles) {
            const nuevoDetalle = new OrdenDetalle({
                ordenId: ordenActualizada._id, 
                cantidad: detalle.cantidad,
                descripcion: detalle.descripcion,
                precioUnitario: detalle.precioUnitario,
                total: detalle.total,
                nota: detalle.nota // Asegurar que 'nota' se guarde correctamente
            });

            await nuevoDetalle.save(); 
        }

        res.status(200).send('Orden actualizada exitosamente');
    } catch (error) {
        console.error('Error al actualizar la orden:', error.message);
        console.error(error.stack);

        res.status(500).send('Hubo un error al actualizar la orden y sus detalles');
    }
};

exports.eliminarOrden = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar los detalles de la orden
        const detallesEliminados = await OrdenDetalle.deleteMany({ ordenId: id });

        if (detallesEliminados.deletedCount === 0) {
            return res.status(404).send('Detalles de la orden no encontrados');
        }

        const ordenEliminada = await Orden.findByIdAndDelete(id);

        if (!ordenEliminada) {
            return res.status(404).send('Orden no encontrada');
        }

        res.json({ message: 'Orden y detalles eliminados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al eliminar la orden y sus detalles');
    }
};