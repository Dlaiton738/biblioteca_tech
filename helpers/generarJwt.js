import jwt from 'jsonwebtoken';

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '4h'
            },
            (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export default generarJWT;