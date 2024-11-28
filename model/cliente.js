const { Schema, model } = require('mongoose');

const clienteSchema = new Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

module.exports = model('Cliente', clienteSchema);
