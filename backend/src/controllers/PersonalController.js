// src/controllers/PersonalController.js
import AppDataSource from "../config/DbConfig.js"
import PersonalSchema from "../schema/PersonalSchema.js"

export const registrarPersonal = async (req, res) => {
    const { nombre, apellido, fechaNac, dni, email, telefono, password, rol } = req.body

    const repo = AppDataSource.getRepository(PersonalSchema)

    const nuevoPersonal = repo.create({ nombre, apellido, fechaNac, dni, email, telefono, password, rol })
    await repo.save(nuevoPersonal)

    res.json({ ok: true, mensaje: "Personal registrado correctamente" })
}