// Se importa el módulo de mysql2
const mysql = require('mysql2');

// Se crea la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'VTtnluhOXUcbrzIMCeZMYlqOprijBBZc',
    database: 'railway',
    port: '16129'
});

// Se conecta a la base de datos
connection.connect((err) => {

    // Si hay un error, se imprime en consola
    if (err) {

        // Se imprime el error
        console.error('Error al conectar a la base de datos: ', err.stack);

        // Se detiene
        return;
    };

    // Se imprime el id de la conexión
    console.log('Conectado a la base de datos con ID: ' + connection.threadId);
});

// Se exporta la conexión
module.exports = connection;