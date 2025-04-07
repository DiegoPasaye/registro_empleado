const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'registro_empleado'
    });

    const password = 'diego123'; // Cambia esto por la contraseña que prefieras
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
        'INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)',
        ['Diego2', hashedPassword, 'admin']
    );

    console.log('Usuario creado con contraseña hasheada');
    process.exit();
}

createUser();
