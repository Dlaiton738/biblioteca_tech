import'dotenv/config';

import app from './app.js';
import { dbconnection } from './database/config.js';

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