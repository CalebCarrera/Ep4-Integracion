const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mesero = require('../model/mesero');
const config = require('../config/global');
const mesero = require('../model/mesero');

exports.crearMesero = async (req, res) => {
    try {
        const { nombre, correo, telefono, password } = req.body;
        const meseroExistente = await Mesero.findOne({ correo });

        if (meseroExistente) {
            return res.status(400).json({mensaje: 'El correo ya esta en uso'});
        }

        const mesero = new Mesero ({
            nombre,
            correo,
            telefono,
            password
        });

        const hashedPassword = await mesero.encryptPassword(password);
        mesero.password = hashedPassword;

        await mesero.save();

        res.status(201).json({mensaje: 'Mesero creado exitosamente', mesero});
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear mesero');
    }
};

exports.validarMesero = async (req, res) => {
    try {
        const { correo, password } = req.body;
        const mesero = await Mesero.findOne({ correo });

        if (!mesero) {
            return res.status(404).json({mensaje: 'Mesero no encontrado'});
        }

        const passwordValido = await mesero.validatedPassword(password);
        if (!passwordValido) {
            return res.status(401).json({mensaje: 'Contraseña incorrecta'});
        }

        const token = jwt.sign(
            { meseroId: mesero._id, nombre: mesero.nombre },
            config.secret, { expiresIn: '1h' }
        );

        res.status(200).json(
            {
                mensaje: 'Mesero validado exitosamente',
                token,
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al validar mesero');
    }
};

exports.obtenerMesero = async (req, res) => {
    try {
        const meseros = await Mesero.find({ activo: true });
        
        res.status(200).json(meseros);
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener meseros');
    }
};

exports.actualizarMesero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, telefono } = req.body;

        const meseroActualizado = await Mesero.findByIdAndUpdate(
            id,
            { nombre, correo, telefono },
            { new: true }
        );

        if (!meseroActualizado) {
            return res.status(404).json({mensaje: 'Mesero no encontrado'});
        }

        res.status(200).json({mensaje: 'Mesero actualizado exitosamente', mesero: meseroActualizado});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar mesero');
    }
};

exports.eliminarMesero = async (req, res) => {
    try {
        const { id } = req.params;
        
        const meseroEliminado = await mesero.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );

        if (!meseroEliminado) {
            return res.status(404).json({mensaje: 'Mesero no encontrado'});
        }

        res.status(200).json({mensaje: 'Mesero eliminado exitosamente'});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar mesero');
    }
};
