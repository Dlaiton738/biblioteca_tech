
const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API REST de BiblioTech!');
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
