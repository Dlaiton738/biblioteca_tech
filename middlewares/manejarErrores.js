
const manejarErrores = (error, req, res, next) => {
    console.error(error);

    // Error de identificador de MongoDB con formato incorrecto
    if (error.name === 'CastError') {
        return res.status(400).json({
            ok: false,
            msg: 'El identificador proporcionado no es válido'
        });
    }

    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map((campo) => ({
            campo: campo.path,
            mensaje: campo.message
        }));

        return res.status(400).json({
            ok: false,
            msg: 'Error de validación',
            errores
        });
    }

    // Error por un dato duplicado: email, ISBN, nombre, etc.
    if (error.code === 11000) {
        const campo = Object.keys(error.keyValue || {})[0];

        return res.status(409).json({
            ok: false,
            msg: 'Ya existe un registro con ese dato',
            campo: campo || 'desconocido'
        });
    }

    // Error de sintaxis en el JSON enviado
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            ok: false,
            msg: 'El cuerpo de la solicitud contiene JSON inválido'
        });
    }

    // Error interno genérico: no exponer detalles al cliente
    return res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor'
    });
};

export default manejarErrores;
