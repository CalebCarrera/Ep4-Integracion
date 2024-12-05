const express = require('express')
const conectarDB = require('./config/db')
const config = require('./config/global')
const cors = require('cors')

const app = express()

conectarDB()

app.use(cors())
app.use(express.json())

app.use(express.static('public'));

app.use('/api', require('./routes/platoRoutes'))
app.use('/api', require('./routes/clientesRoutes'))
app.use('/api', require('./routes/ordenRoutes'))
app.use('/api', require('./routes/categoriaRoutes'))
app.use('/api', require('./routes/meseroRoutes'))

app.listen(config.port, () => {
    console.log('El servidor corriendo por el puerto 3000')
})