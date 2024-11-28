const { Schema, model } = require('mongoose');

const platoSchema = new Schema({
    nombre: { type: String, required: true },
    ingredientes: { type: [String], required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: false }, 
}, {
    timestamps: true
});

module.exports = model('Plato', platoSchema);
