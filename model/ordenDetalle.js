const { Schema, model } = require('mongoose');

const ordenDetalleSchema = new Schema({
    ordenId: { type: Schema.Types.ObjectId, ref: 'Orden', required: true },
    platoId: { type: Schema.Types.ObjectId, ref: 'Plato', required: true },
    cantidad: { type: Number, required: true }, 
    descripcion: { type: String, required: true }, 
    precioUnitario: { type: Number, required: true }, 
    total: { type: Number, required: true }, 
    nota: { type: String, required: false }, 
}, {
    timestamps: true
});

module.exports = model('OrdenDetalle', ordenDetalleSchema);
