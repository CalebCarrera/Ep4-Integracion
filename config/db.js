const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Ep3');
        console.log("Conexión exitosa a MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = conectarDB;  
