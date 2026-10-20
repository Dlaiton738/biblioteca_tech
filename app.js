import express from 'express';
import cors from 'cors';

import usersRouters from './routers/usersRouters.js';
import authRouters from './routers/authRouters.js';
import authorsRouters from './routers/authorsRouters.js';
import loansRouters from './routers/loansRouters.js';
import booksRouters from './routers/booksRouters.js';
import manejarErrores from './middlewares/manejarErrores.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API REST de BiblioTech!');
});

app.use("/api/books", booksRouters);
app.use('/api/users', usersRouters);
app.use('/api/auth', authRouters);
app.use('/api/authors', authorsRouters);
app.use('/api/loans', loansRouters);


// Middleware centralizado para manejar errores
app.use(manejarErrores);

export default app;
