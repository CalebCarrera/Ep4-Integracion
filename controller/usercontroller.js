const User = require('../model/user')
const config = require('../config/global');

exports.crearUsuario = async (req, res) => {
    try {
        const { nombres, apellidos, email, password } = req.body;
        
        let usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).send('El usuario ya existe');
        }

        const usuario = new User({
            nombres,
            apellidos,
            email,
            password,  
        });

        const hashedPassword = await usuario.encryptPassword(password);

        usuario.password = hashedPassword;

        await usuario.save();

        res.send('Usuario creado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.validarUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        let usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).send('Usuario no encontrado');
        }

        const passwordValido = await usuario.validatePassword(password);
        if (!passwordValido) {
            return res.status(400).send('Contraseña incorrecta');
        }

        res.json({ message: 'Inicio de sesión exitoso'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};