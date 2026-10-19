const tieneRol = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                ok: false,
                msg: "Se debe validar el token primero"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                ok: false,
                msg: "No tiene permisos para realizar esta acción"
            });
        }

        next();
    };
};

export default tieneRol;
