
const mongoose = require('mongoose');  // Agrega esta línea
const Plato = require('../model/plato');
const Orden = require('../model/orden')
const OrdenDetalle = require('../model/ordenDetalle')
const config = require('../config/global');
exports.crearOrden = async (req, res) => {
    try {
        const { numeroMesa, platillos, estado } = req.body;

        // Verificar que se proporcionen los campos obligatorios
        if (!numeroMesa || !platillos || platillos.length === 0) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        // Verificar que el estado sea uno de los valores permitidos, si se proporciona
        const estadosPermitidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
        if (estado && !estadosPermitidos.includes(estado)) {
            return res.status(400).send('Estado inválido. Los estados permitidos son: pendiente, preparando, listo, entregado, cancelado.');
        }

        let totalOrden = 0;
        const detalles = [];

        // Procesar los platillos seleccionados
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
                total: totalPlato 
            });
        }

        // Crear la nueva orden con el estado elegido o el predeterminado
        const nuevaOrden = new Orden({
            numeroMesa, 
            platillos: detalles,
            total: totalOrden,
            estado: estado || 'pendiente' 
        });

        // Guardar la orden
        const ordenGuardada = await nuevaOrden.save();

        // Crear los detalles de la orden
        for (const detalle of detalles) {
            const nuevoDetalle = new OrdenDetalle({
                ordenId: ordenGuardada._id, 
                cantidad: detalle.cantidad,
                descripcion: detalle.descripcion,
                precioUnitario: detalle.precioUnitario,
                total: detalle.total
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
                total: detalle.total
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
        const { numeroMesa, platillos, estado } = req.body; // Agregar 'estado' al cuerpo de la solicitud

        // Verificar que la lista de platillos no esté vacía
        if (!platillos || platillos.length === 0) {
            return res.status(400).send('Se deben proporcionar platillos');
        }

        // Verificar que el estado, si se proporciona, sea uno de los valores permitidos
        const estadosPermitidos = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
        if (estado && !estadosPermitidos.includes(estado)) {
            return res.status(400).send('Estado inválido. Los estados permitidos son: pendiente, preparando, listo, entregado, cancelado.');
        }

        // Actualizar la orden con el número de mesa, el total calculado y el estado
        const ordenActualizada = await Orden.findByIdAndUpdate(
            id,
            { 
                numeroMesa, 
                total: platillos.reduce((total, item) => total + (item.cantidad * item.precio), 0),
                estado: estado || undefined // Si el estado se proporciona, actualizarlo
            },
            { new: true }
        );

        // Si la orden no se encuentra, devolver error
        if (!ordenActualizada) {
            return res.status(404).send('Orden no encontrada');
        }

        // Eliminar los detalles de la orden actual antes de agregar los nuevos
        await OrdenDetalle.deleteMany({ ordenId: id });

        for (const item of platillos) {
            // Verificar si se proporcionó un platoId
            if (!item.platoId) {
                return res.status(400).send('Falta el platoId en uno de los platillos');
            }

            // Buscar el plato por platoId
            const plato = await Plato.findById(item.platoId);
            if (!plato) {
                return res.status(404).send(`Plato con ID ${item.platoId} no encontrado`);
            }

            // Crear un nuevo detalle de la orden
            const nuevoDetalle = new OrdenDetalle({
                ordenId: ordenActualizada._id,
                cantidad: item.cantidad,
                descripcion: plato.nombre,
                precioUnitario: plato.precio,
                total: item.cantidad * plato.precio,
                platoId: item.platoId // Asegurarse de que el platoId se guarda
            });

            // Guardar el nuevo detalle
            await nuevoDetalle.save();
        }

        res.json({
            message: 'Orden y sus detalles actualizados exitosamente',
            orden: ordenActualizada,
            detalles: platillos
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al actualizar la orden y sus detalles');
    }
};

exports.eliminarOrden = async (req, res) => {
    try {
        const { id } = req.params;

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
