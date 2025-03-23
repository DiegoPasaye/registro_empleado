const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')


const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});
app.get('/alta', (req, res) => {
    res.sendFile(path.join(__dirname, 'alta.html'));
});
app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'consulta.html'));
});


app.get('/empleados', (req, res) => {
  const query = 'SELECT id, nombre, email, puesto, fechaNacimiento, genero, tipoContrato FROM empleados';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error al consultar empleados:', error);
          return res.status(500).json({ error: 'Error al obtener empleados' });
      }
      res.json(results);
  });
});
app.delete('/empleados/:id', (req, res) => {
  const {id} = req.params
  const query = 'DELETE FROM empleados where id = ?';
  connection.query(query, [id], (error, result) => {
    if(error){
      return res.status(500).send('Ha habido un error')
    }else{
      res.status(200).send('Empleado eliminado correctamente')
    }
  })
    
})


// Ruta de registro de empleados
app.post('/register', (req, res) => {
    const { nombre, email, puesto, fechaNacimiento, documentosEntregados, genero, tipoContrato } = req.body;
  
    if (!nombre || !email || !puesto || !fechaNacimiento || !documentosEntregados || !genero || !tipoContrato) {
      return res.status(400).send('Todos los campos son obligatorios');
    }


    const curp = documentosEntregados.curp ? 'Si' : 'No'
    const rfc = documentosEntregados.rfc ? 'Si' : 'No'
    const nss = documentosEntregados.nss ? 'Si' : 'No'
    const formattedFechaNacimiento = new Date(fechaNacimiento).toISOString().split('T')[0]
  
    const query = 'INSERT INTO empleados (nombre, email, puesto, fechaNacimiento, curp, rfc,nss, genero, tipoContrato) VALUES (?, ?, ?, ?,?,?,?,?,?)';
    //SIEMORE USAR (?) EN LOS VALUES PARA EVITAR LA INYECCION SQL

    connection.execute(query, [nombre, email, puesto, formattedFechaNacimiento, curp, rfc, nss, genero, tipoContrato], (error, results) => {
      if (error) {
        console.error('Error al insertar en la base de datos:', error);
        return res.status(500).send('Error al registrar empleado');
      }
      res.status(201).send('Empleado registrado correctamente');
    });
  });
  
  // Inicia el servidor

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log('Escuchando en el puerto ' + PORT)
  });
  


// PONER EN OTRO ARCHIVO SIEMPRE (connections)
// Conexión a la base de datos con mysql2
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registro_empleado',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a MySQL con ID ' + conn.threadId);
    conn.release();
});

