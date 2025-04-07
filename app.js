const express = require('express');
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const session = require('express-session')


const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.static(__dirname));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
  
app.use(session({
    secret: 'clave_super_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
}
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/alta', (req, res) => {
    res.sendFile(path.join(__dirname, 'alta.html'));
});
app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'consulta.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const [users] = await connection.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  
      if (users.length === 0) {
        return res.status(401).json({ error: 'Usuario no existe' });
      }
  
      const user = users[0];
      const valid = await bcrypt.compare(password, user.password);
  
      if (!valid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
  
      req.session.regenerate(err => {
        if (err) {
          console.error('Error al regenerar sesión:', err);
          return res.status(500).json({ error: 'Error en la sesión' });
        }
  
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role
        };
  
        console.log('Sesión creada:', req.session.user); // depuración
        const redirectURL = user.role === 'admin' ? '/admin-dashboard.html' : '/employee-dashboard.html';
        res.json({ success: true, redirect: redirectURL });
      });
  
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
});


app.get('/empleados', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT id, nombre, email, puesto, fechaNacimiento, genero, tipoContrato FROM empleados');
    res.json(results);
  } catch (error) {
    console.error('Error al consultar empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
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

  app.get('/logout', (req, res) => {
      req.session.destroy(err => {
          if (err) {
              console.error('Error al cerrar sesión:', err);
              return res.status(500).send('No se pudo cerrar sesión');
          }
  
          res.clearCookie('connect.sid'); // elimina cookie
          res.redirect('/');
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
});


connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a MySQL con ID ' + conn.threadId);
    conn.release();
});

