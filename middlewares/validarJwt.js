import jwt from "jsonwebtoken";
import Users from "../models/users.js";

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No hay token en la petición"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findById(uid);

        if (!user || !user.active) {
            return res.status(401).json({
                ok: false,
                msg: "Token no válido"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no válido"
        });
    }
};

export default validarJWT;