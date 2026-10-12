require('dotenv').config();

const app = require('./app');
const { dbconnection } = require('./database/config');

const PORT = process.env.PORT || 3000;

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