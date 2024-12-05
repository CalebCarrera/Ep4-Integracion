const mongoose = require('mongoose');
const Categoria = require('../model/categoria');
const config = require('../config/global');

exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const nuevaCategoria = new Categoria({ nombre, descripcion });
        await nuevaCategoria.save();

        res.status(201).json({mensaje: 'Categoria creada exitosamente', categoria: nuevaCategoria});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear categoria');
    }
};

exports.obtenerCategoria = async (req, res) => {
    try {
        const categorias = await Categoria.find();

        res.status(200).json(categorias);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener categorias');
    }
};

exports.actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            id,
            { nombre, descripcion },
            { new: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).json({mensaje: 'Categoria no encontrada'});
        }

        res.status(200).json({mensaje: 'Categoria actualizada exitosamente', categoria: categoriaActualizada});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar categoria');
    }
};

exports.eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);

        if (!categoriaEliminada) {
            return res.status(404).json({mensaje: 'Categoria no encontrada'});
        }

        res.status(200).json({mensaje: 'Categoria eliminada exitosamente'});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar categoria');
    }
};