const { Schema, model } = require('mongoose');

const ordenSchema = new Schema({
    numeroMesa: { type: Number, required: true },
    platillos: [
        {
            platoId: { type: Schema.Types.ObjectId, ref: 'Plato', required: true },
            cantidad: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    estado: { type: String, enum: ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'], default: 'pendiente' },
}, {
    timestamps: true
});

module.exports = model('Orden', ordenSchema);

