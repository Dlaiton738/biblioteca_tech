require('dotenv').config();

const { dbconnection } = require('./database/config');

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API REST de BiblioTech!');
});

dbconnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });