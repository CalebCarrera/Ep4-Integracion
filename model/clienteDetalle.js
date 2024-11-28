const { Schema, model } = require('mongoose');

const clienteDetalleSchema = new Schema({
    clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    direccion: { type: String, required: true },
    edad: { type: Number, required: true }, 
    sexo: { type: String, enum: ['Masculino', 'Femenino', 'Otro'], required: true },
    estadoCivil: { type: String, enum: ['Soltero', 'Casado', 'Divorciado', 'Viudo'], required: true },
}, {
    timestamps: true
});

module.exports = model('ClienteDetalle', clienteDetalleSchema);
