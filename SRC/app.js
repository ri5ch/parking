const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parking'
});

conexion.connect((error) => {
    if (error) {
        console.log('Error al conectar a la BBDD');
        return;
    }
    console.log('Conexión establecida correctamente');
});

app.get('/', function (req, res) {
    res.sendFile('views/pages/index.html', { root: __dirname });
});

const cochesIngresados = []; // Array para mantener registro de coches ingresados

app.get('/metercoche', (req, res) => {
    const plaza = req.query.plaza;

    CocheAleatorio((error, coche) => {
        if (error) {
            console.error('Error al obtener coche aleatorio:', error);
            res.status(500).send('Error al obtener coche aleatorio');
            return;
        }

        if (coche.length === 0) { // Verificar si no hay coches disponibles
            console.error('No hay coches disponibles');
            res.status(500).send('No hay coches disponibles');
            return;
        }

        const idCoche = coche[0].id;

        meterCoche(idCoche, plaza)
            .then(() => {
                res.send('Plaza ocupada correctamente');
            })
            .catch(error => {
                console.error('Error al ocupar plaza:', error);
                res.status(500).send('Error al ocupar plaza');
            });
    });
});

function meterCoche(idCoche, numeroPlaza) {
    return new Promise((resolve, reject) => {
        conexion.query("UPDATE plaza SET estado = 'ocupado' WHERE numero_plaza = ?", [numeroPlaza], (error, resultado) => {
            if (error) {
                console.error('Error al ocupar plaza:', error);
                reject(error);
            } else {
                console.log('Plaza ocupada correctamente');
                cochesIngresados.push(idCoche); // Agregar el ID del coche ingresado a la lista
                insertarCompra(idCoche, numeroPlaza); // Insertar la compra en la base de datos
                resolve();
            }
        });
    });
}

app.get('/sacarcoche', (req, res) => {
    const numeroPlaza = req.query.plaza;
    conexion.query("UPDATE plaza SET estado = 'libre' WHERE numero_plaza = ?", [numeroPlaza], (error, resultado) => {
        if (error) {
            console.error('Error al liberar plaza:', error);
            res.status(500).send('Error al liberar plaza');
            return;
        }

        if (cochesIngresados.length > 0) {
            const ultimoCocheIngresado = cochesIngresados.pop(); // Sacar el último coche ingresado
            insertarCompraDespues(numeroPlaza);
        }

        console.log('Plaza liberada correctamente');
        res.send('Plaza liberada correctamente');
    });
});

function CocheAleatorio(callback) {
    const query = 'SELECT * FROM coche WHERE id NOT IN (SELECT id_coche FROM compra) ORDER BY RAND() LIMIT 1';
    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
}

function insertarCompra(idCoche, numeroPlaza) {
    const query = "INSERT INTO compra (id_coche, id_plaza) VALUES (?, ?)";
    conexion.query(query, [idCoche, numeroPlaza], (err, result) => {
        if (err) {
            console.error('Error al insertar registro en la base de datos MySQL:', err);
            return;
        }
        console.log('Registro insertado correctamente');
    });
}

function insertarCompraDespues(numeroPlaza) {
    const query = "UPDATE compra SET hora_salida = CURRENT_TIMESTAMP WHERE id_plaza = ?";
    conexion.query(query, [numeroPlaza], (err) => {
        if (err) {
            console.error('Error al actualizar el registro en la base de datos MySQL:', err);
            return;
        }
        console.log('Registro actualizado correctamente');
    });
}
app.get('/detallescompra', (req, res) => {
    // Realiza una consulta SQL para obtener el total de compras
    conexion.query("SELECT SUM(total) AS total_compras FROM compra", (errorTotal, total) => {
        if (errorTotal) {
            console.error('Error al calcular el total de compras:', errorTotal);
            res.status(500).send('Error al calcular el total de compras');
            return;
        }

        // Realiza una consulta SQL para obtener todos los detalles de compra
        conexion.query("SELECT id, DATE_FORMAT(hora_entrada, '%Y-%m-%d %H:%i:%s') AS hora_entrada, DATE_FORMAT(hora_salida, '%Y-%m-%d %H:%i:%s') AS hora_salida, id_coche, total, id_plaza FROM compra", (errorDetalles, detalles) => {
            if (errorDetalles) {
                console.error('Error al obtener detalles de compra:', errorDetalles);
                res.status(500).send('Error al obtener detalles de compra');
                return;
            }

            // Obtén el total de compras del resultado de la consulta
            const totalCompras = total[0].total_compras;

            // Combina los resultados
            const resultado = {
                total_compras: totalCompras,
                detalles: detalles
            };

            // Envía el resultado al cliente
            res.json(resultado);
        });
    });
});


const port = 5000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
