import express from 'express';
import cors from'cors';

import usersRouters from './routers/usersRouters.js';
import authRouters from './routers/authRouters.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API REST de BiblioTech!');
});


app.use('/api/users',usersRouters)
app.use('/api/auth',authRouters)

export default app;