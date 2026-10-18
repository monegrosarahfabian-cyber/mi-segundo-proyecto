const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Servir la PWA y recursos estáticos
app.use(express.static(__dirname));

// Conexión a Base de Datos SQLite
const dbPath = path.join(__dirname, 'grupo_reyna.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error DB:', err.message);
    else console.log('Base de datos grupo_reyna.db conectada correctamente.');
});

// Tablas de la App
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS contactos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        servicio TEXT,
        mensaje TEXT,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS prestamos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        monto REAL,
        tasa REAL,
        meses INTEGER,
        cuota REAL,
        intereses REAL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Guardar Contacto
app.post('/api/contactos', (req, res) => {
    const { nombre, servicio, mensaje } = req.body;
    db.run(`INSERT INTO contactos (nombre, servicio, mensaje) VALUES (?, ?, ?)`,
        [nombre, servicio, mensaje],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ status: 'exito', id: this.lastID });
        }
    );
});

// Guardar Préstamo
app.post('/api/prestamos', (req, res) => {
    const { amount, rate, months, monthlyPayment, totalInterest } = req.body;
    db.run(`INSERT INTO prestamos (monto, tasa, meses, cuota, intereses) VALUES (?, ?, ?, ?, ?)`,
        [amount, rate, months, monthlyPayment, totalInterest],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ status: 'exito', id: this.lastID });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de App Grupo Reyna corriendo en: http://localhost:${PORT}`);
});