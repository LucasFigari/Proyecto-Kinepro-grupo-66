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

export const validarDniUnico = async (req, res) => {

    const { dni } = req.params

    const repo = AppDataSource.getRepository(PersonalSchema)

    const personalExistente = await repo.findOne({ where: { dni: dni }})

    if(personalExistente){
        res.json({ existe: true })
    }
    else{
        res.json({ existe: false })
    }
}

export const validarCorreoUnico = async (req, res) => {

    const { email } = req.params

    const repo = AppDataSource.getRepository(PersonalSchema)

    const personalExistente = await repo.findOne({ where: { email: email }})

    if(personalExistente){
        res.json({ existe: true })
    }
    else{
        res.json({ existe: false })
    }
}