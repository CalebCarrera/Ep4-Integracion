const mongoose = require('mongoose'); 
const Cliente = require('../model/cliente');
const ClienteDetalle = require('../model/clienteDetalle');
const config = require('../config/global');

exports.crearCliente = async (req, res) => {
    try {
        const { nombre, correo, telefono, dni, direccion, edad, sexo, estadoCivil, notas } = req.body;

        if (!nombre || !correo || !telefono || !dni) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        const nuevoCliente = new Cliente({
            nombre,
            correo,
            telefono,
            dni
        });

        const clienteGuardado = await nuevoCliente.save();

        const detallesCliente = new ClienteDetalle({
            clienteId: clienteGuardado._id,
            direccion,
            edad,
            sexo,
            estadoCivil,
            notas
        });

        await detallesCliente.save();

        res.status(201).send('Cliente y sus detalles creados exitosamente');
    } catch (error) {
        console.error('Error al crear el cliente:', error.message);
        console.error(error.stack);

        res.status(500).send('Hubo un error al crear el cliente y sus detalles');
    }
};

exports.obtenerCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).send('Cliente no encontrado');
        }

        const detalles = await ClienteDetalle.findOne({ clienteId: id });

        res.json({
            nombre: cliente.nombre,
            correo: cliente.correo,
            telefono: cliente.telefono,
            dni: cliente.dni,
            direccion: detalles?.direccion || 'Sin dirección',
            edad: detalles?.edad || 'No especificada',
            sexo: detalles?.sexo || 'No especificado',
            estadoCivil: detalles?.estadoCivil || 'No especificado',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al obtener el cliente y sus detalles');
    }
};

exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, telefono, dni, direccion, edad, sexo, estadoCivil, notas } = req.body;

        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id,
            { nombre, correo, telefono, dni },
            { new: true }
        );

        if (!clienteActualizado) {
            return res.status(404).send('Cliente no encontrado');
        }

        const detallesActualizados = await ClienteDetalle.findOneAndUpdate(
            { clienteId: id },
            { direccion, edad, sexo, estadoCivil, notas },
            { new: true }
        );

        if (!detallesActualizados) {
            return res.status(404).send('Detalles del cliente no encontrados');
        }

        res.json({
            message: 'Cliente y sus detalles actualizados exitosamente',
            cliente: clienteActualizado,
            detalles: detallesActualizados
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al actualizar el cliente y sus detalles');
    }
};

exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const detallesEliminados = await ClienteDetalle.deleteMany({ clienteId: id });

        if (detallesEliminados.deletedCount === 0) {
            return res.status(404).send('Detalles del cliente no encontrados');
        }

        const clienteEliminado = await Cliente.findByIdAndDelete(id);

        if (!clienteEliminado) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.json({ message: 'Cliente y detalles eliminados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al eliminar el cliente y sus detalles');
    }
};