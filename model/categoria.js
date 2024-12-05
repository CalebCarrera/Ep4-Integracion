const { Schema, model } = require('mongoose');

const categoriaSchema = new Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String},
}, {
    timestamps: true
})

module.exports = model('Categoria', categoriaSchema);