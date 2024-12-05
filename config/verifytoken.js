const jwt = require('jsonwebtoken');
const config = require('./global');

function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({mensaje: 'No se ha proporcionado un token'});
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.meseroId = decoded.meseroId;
        next();

    } catch (error) {
        res.status(401).json({mensaje: 'Token no válido'});
    }
}

module.exports = verifyToken;