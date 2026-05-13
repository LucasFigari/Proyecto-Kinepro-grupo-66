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