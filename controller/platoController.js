const mongoose = require('mongoose');  // Agrega esta línea
const Plato = require('../model/plato');
const PlatoDetalle = require('../model/platoDetalle');
const config = require('../config/global');

exports.crearPlato = async (req, res) => {
    try {
        const { nombre, ingredientes, precio, imagen, descripcion, calorias } = req.body;

        if (!nombre || !ingredientes || !precio) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        const nuevoPlato = new Plato({
            nombre,
            ingredientes,
            precio,
            imagen
        });

        const platoGuardado = await nuevoPlato.save();

        const detallesPlato = new PlatoDetalle({
            platoId: platoGuardado._id,
            descripcion,
            calorias
        });

        await detallesPlato.save();

        res.status(201).send('Plato y sus detalles creados exitosamente');
    } catch (error) {
        console.error('Error al crear el plato:', error.message);
        console.error(error.stack);

        res.status(500).send('Hubo un error al crear el plato y sus detalles');
    }
};



exports.obtenerPlato = async (req, res) => {
    try {
        const { id } = req.params;

        const plato = await Plato.findById(id);
        if (!plato) {
            return res.status(404).send('Plato no encontrado');
        }

        const detalles = await PlatoDetalle.findOne({ platoId: id });

        res.json({
            nombre: plato.nombre,
            ingredientes: plato.ingredientes,
            precio: plato.precio,
            imagen: plato.imagen,
            descripcion: detalles?.descripcion || 'Sin descripción',
            calorias: detalles?.calorias || 'No especificadas'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al obtener el plato y sus detalles');
    }
};

exports.actualizarPlato = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ingredientes, precio, imagen, descripcion, calorias } = req.body;

        const platoActualizado = await Plato.findByIdAndUpdate(
            id,
            { nombre, ingredientes, precio, imagen },
            { new: true }
        );

        if (!platoActualizado) {
            return res.status(404).send('Plato no encontrado');
        }

        // Actualizar los detalles del plato
        const detallesActualizados = await PlatoDetalle.findOneAndUpdate(
            { platoId: id },
            { descripcion, calorias },
            { new: true }
        );

        if (!detallesActualizados) {
            return res.status(404).send('Detalles del plato no encontrados');
        }

        res.json({
            message: 'Plato y sus detalles actualizados exitosamente',
            plato: platoActualizado,
            detalles: detallesActualizados
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al actualizar el plato y sus detalles');
    }
};

exports.eliminarPlato = async (req, res) => {
    try {
        const { id } = req.params;

        const detallesEliminados = await PlatoDetalle.deleteMany({ platoId: id });

        if (detallesEliminados.deletedCount === 0) {
            return res.status(404).send('Detalles del plato no encontrados');
        }

        const platoEliminado = await Plato.findByIdAndDelete(id);

        if (!platoEliminado) {
            return res.status(404).send('Plato no encontrado');
        }

        res.json({ message: 'Plato y detalles eliminados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al eliminar el plato y sus detalles');
    }
};
