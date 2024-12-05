const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const meseroSchema = new Schema({
    nombre: {type: String, required: true},
    correo: {type: String, required: true},
    telefono: {type: String, required: true},
    activo: {type: Boolean, default: true},
    password: {type: String, required: true},
}, {
    timestamps: true
});

meseroSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

meseroSchema.methods.validatedPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model('Mesero', meseroSchema);