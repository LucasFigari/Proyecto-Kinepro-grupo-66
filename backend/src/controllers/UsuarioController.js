// src/controllers/UsuarioController.js
import AppDataSource from "../config/DbConfig.js"
import UserSchema from "../schema/UsuarioSchema.js"

export const registrarUsuario = async (req, res) => {
    const { nombre, apellido, dni, email, telefono, password } = req.body

    const repo = AppDataSource.getRepository(UserSchema)

    const nuevoUsuario = repo.create({ nombre, apellido, dni, email, telefono, password })
    await repo.save(nuevoUsuario)

    res.json({ ok: true, mensaje: "Usuario registrado correctamente" })
}

export const verificarDni = async (req, res) => {
    const { dni } = req.params

    const repo = AppDataSource.getRepository(UserSchema)

    const usuarioExistente = await repo.findOne({ where: { dni: dni } })

    if(usuarioExistente){
        res.json({ existe: true })
    } 
    else {
        res.json({ existe: false })
    }
}

export const verificarEmail = async (req, res) => {
    const { email } = req.params

    const repo = AppDataSource.getRepository(UserSchema)

    const usuarioExistente = await repo.findOne({where: { email: email } })

    if(usuarioExistente){
        res.json({ existe: true })
    }
    else{
        res.json({ existe: false })
    }
}

export const obtenerPerfilCliente = async (req, res) => {
    try {
        const { id } = req.params; 
        const repo = AppDataSource.getRepository(UserSchema)
        const usuario = await repo.findOne({where: { id: Number(id) } });
        if (!usuario) {
            return res.status(404).json({ message: "El usuario no existe en el sistema" });
        }       
        return res.json(usuario);
    } catch (error) {
        console.error("Error en obtenerPerfilCliente:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};