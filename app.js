// Se importa el módulo de express y las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

// Se inicializa el servidor
const app = express();

// Se define el puerto
const port = 3000;

// Middleware para parsear el body de las peticiones
app.use(bodyParser.json());

// Se valida que cuando este en la ruta raíz, se imprima un mensaje
app.get('/', (req, res) => {

    // Inicializame las apis de habitaciones y reservas
    const apis = {
        habitaciones: {
            obtener: {
                metodo: 'GET',
                descripcion: 'Obtener todas las habitaciones',
                ruta: '/rooms'
            },
            obtenerPorCodigo: {
                metodo: 'GET',
                descripcion: 'Obtener una habitación por su código',
                ruta: '/rooms/:codigo'
            },
            crear: {
                metodo: 'POST',
                descripcion: 'Crear una habitación',
                ruta: '/rooms'
            },
            actualizar: {
                metodo: 'PATCH',
                descripcion: 'Actualizar una habitación',
                ruta: '/rooms/:codigo'
            },
            eliminar: {
                metodo: 'DELETE',
                descripcion: 'Eliminar una habitación',
                ruta: '/rooms/:codigo'
            }
        },
        reservas: {
            obtener: {
                metodo: 'GET',
                descripcion: 'Obtener todas las reservas',
                ruta: '/bookings'
            },
            obtenerPorCodigo: {
                metodo: 'GET',
                descripcion: 'Obtener una reserva por su código',
                ruta: '/bookings/:codigo'
            },
            crear: {
                metodo: 'POST',
                descripcion: 'Crear una reserva',
                ruta: '/bookings'
            },
            actualizar: {
                metodo: 'PATCH',
                descripcion: 'Actualizar una reserva',
                ruta: '/bookings/:codigo'
            },
            eliminar: {
                metodo: 'DELETE',
                descripcion: 'Eliminar una reserva',
                ruta: '/bookings/:codigo'
            }
        }
    };

    // Se imprime con un json
    res.json({
        mensaje: "Bienvenido al sistema de gestión de habitaciones y reservas, estas son las rutas disponibles",
        apis: apis
    });
});

// Rutas para habitaciones
app.get('/rooms', (req, res) => {

    // Se realiza la consulta a la base de datos
    db.query('SELECT codigo, numero, tipo, valor FROM habitaciones', (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).json({
                mensaje: "Error al consultar los registros en la base de datos",
                error: err
            });
        };

        // Se imprime con un json
        res.json({
            mensaje: "Se encontraron " + results.length + " registros",
            habitaciones: results,
        })
    });
});

// Se define la ruta para obtener una habitación por su código
app.get('/rooms/:codigo', (req, res) => {

    // Se obtiene el código de la habitación
    const { codigo } = req.params;

    // Se realiza la consulta a la base de datos
    db.query('SELECT codigo, numero, tipo, valor FROM habitaciones WHERE codigo = ?', [codigo], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).json({
                mensaje: "Error al consultar los registros en la base de datos",
                error: err
            });
        };

        // Se valida si no se encontró el registro
        if (results.length === 0) {

            // Se envía un mensaje de error
            return res.status(404).json({
                mensaje: "No se encontró la habitación con el código " + codigo
            });
        };

        // Se imprime con un json
        res.json({
            mensaje: "Se encontro el registro en la base de datos",
            habitaciones: results[0],
        });
    });
});

// Se define la ruta para crear una habitación
app.post('/rooms', (req, res) => {

    // Se obtienen los datos de la habitación
    const { numero, tipo, valor } = req.body;

    // Se realiza la consulta a la base de datos
    db.query('INSERT INTO habitaciones (numero, tipo, valor) VALUES (?, ?, ?)', [numero, tipo, valor], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).json({
                mensaje: "Error al insertar el registro en la base de datos",
                error: err
            });
        };

        // Se imprime con un json
        res.status(201).send({
            mensaje: "Habitación creada",
            codigo: results.insertId
        });
    });
});

// Se define la ruta para actualizar una habitación
app.patch('/rooms/:codigo', (req, res) => {

    // Se obtiene el código de la habitación
    const { codigo } = req.params;

    // Se obtienen los datos de la habitación
    const { numero, tipo, valor } = req.body;

    // Se realiza la consulta a la base de datos
    db.query('UPDATE habitaciones SET numero = ?, tipo = ?, valor = ? WHERE codigo = ?', [numero, tipo, valor, codigo], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al actualizar el registro en la base de datos",
                error: err
            });
        };

        // Se imprime con un json
        res.send({
            mensaje: "Habitación actualizada"
        });
    });
});

// Se define la ruta para eliminar una habitación
app.delete('/rooms/:codigo', (req, res) => {

    // Se obtiene el código de la habitación
    const { codigo } = req.params;

    // Se realiza la consulta a la base de datos
    db.query('DELETE FROM habitaciones WHERE codigo = ?', [codigo], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al eliminar el registro en la base de datos",
                error: err
            });
        };

        // Se imprime con un json
        res.send({
            mensaje: "Habitación eliminada"
        });
    });
});

// Rutas para reservas
app.get('/bookings', (req, res) => {

    // Se realiza la consulta a la base de datos
    db.query('SELECT codigo, codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida FROM reservas', (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al consultar los registros en la base de datos",
                error: err
            });
        };

        // Se formatea las fechas con las horas en hora local Colombia
        results = results.map(reserva => {
            reserva.fecha_reservacion = new Date(reserva.fecha_reservacion).toLocaleString('es-CO');
            reserva.fecha_entrada = new Date(reserva.fecha_entrada).toLocaleString('es-CO');
            reserva.fecha_salida = new Date(reserva.fecha_salida).toLocaleString('es-CO');
            return reserva;
        });

        // Se imprime con un json
        res.json({
            mensaje: "Se encontraron " + results.length + " registros",
            reservas: results,
        });
    });
});

// Se define la ruta para obtener una reserva por su código
app.get('/bookings/:codigo', (req, res) => {

    // Se obtiene el código de la reserva
    const { codigo } = req.params;

    // Se realiza la consulta a la base de datos
    db.query('SELECT codigo, codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida FROM reservas WHERE codigo = ?', [codigo], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al consultar los registros en la base de datos",
                error: err
            });
        };

        // Se valida si no se encontró el registro
        if (results.length === 0) {

            // Se envía un mensaje de error
            return res.status(404).send({
                mensaje: "No se encontró la reserva con el código " + codigo
            });
        };

        // Se formatea las fechas con las horas en hora local Colombia
        results = results.map(reserva => {
            reserva.fecha_reservacion = new Date(reserva.fecha_reservacion).toLocaleString('es-CO');
            reserva.fecha_entrada = new Date(reserva.fecha_entrada).toLocaleString('es-CO');
            reserva.fecha_salida = new Date(reserva.fecha_salida).toLocaleString('es-CO');
            return reserva;
        });

        // Se imprime con un json
        res.json({
            mensaje: "Se encontro el registro en la base de datos",
            reservas: results[0],
        });
    });
});

// Se define la ruta para crear una reserva
app.post('/bookings', (req, res) => {

    // Se obtienen los datos de la reserva
    const { codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida } = req.body;

    // Se realiza la consulta a la base de datos
    db.query('INSERT INTO reservas (codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?, ?, ?)', [codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al insertar el registro en la base de datos",
                error: err
            });
        };

        // Se imprime con un json
        res.status(201).send({
            mensaje: "Reserva creada",
            codigo: results.insertId
        });
    });
});

// Se define la ruta para actualizar una reserva
app.patch('/bookings/:codigo', (req, res) => {

    // Se obtiene el código de la reserva
    const { codigo } = req.params;

    // Se obtienen los datos de la reserva
    const { codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida } = req.body;

    // Se realiza la consulta a la base de datos
    db.query('UPDATE reservas SET codigo_habitacion = ?, nombre_cliente = ?, telefono_cliente = ?, fecha_reservacion = ?, fecha_entrada = ?, fecha_salida = ? WHERE codigo = ?', [codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida, codigo], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al actualizar el registro en la base de datos",
                error: err
            });
        };

        // Se imprime con un json
        res.send({
            mensaje: "Reserva actualizada"
        });
    });
});

// Se define la ruta para eliminar una reserva
app.delete('/bookings/:codigo', (req, res) => {

    // Se obtiene el código de la reserva
    const { codigo } = req.params;

    // Se realiza la consulta a la base de datos
    db.query('DELETE FROM reservas WHERE codigo = ?', [codigo], (err, results) => {

        // Si hay un error, se envía un mensaje de error
        if (err) {

            // Se envía un mensaje de error
            return res.status(500).send({
                mensaje: "Error al eliminar el registro en la base de datos",
                error: err
            });
        };

        // Se valida si no se eliminó ningún registro
        res.send({
            mensaje: "Reserva eliminada"
        });
    });
});

// Se inicia el servidor
app.listen(port, () => {

    // Se imprime un mensaje en la consola
    console.log(`Servidor escuchando en http://localhost:${port}`);
});