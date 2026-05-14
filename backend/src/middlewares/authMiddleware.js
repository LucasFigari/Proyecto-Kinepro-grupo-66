import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ mensaje: "Token no proporcionado" });
    }

    // Aquí es donde se validará cuando tengan la CLAVE_SECRETA
    // jwt.verify(token, 'CLAVE_SECRETA', (err, decoded) => { ... });

    next(); // Por ahora deja pasar para que no se traben
};