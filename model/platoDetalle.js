const { Schema, model } = require('mongoose');

const platoDetalleSchema = new Schema({
    platoId: { type: Schema.Types.ObjectId, ref: 'Plato', required: true },
    descripcion: { type: String, required: true }, 
    calorias: { type: Number, required: false },
}, {
    timestamps: true // Registra createdAt y updatedAt
});

module.exports = model('PlatoDetalle', platoDetalleSchema);
