// src/controllers/PersonalController.js
import AppDataSource from "../config/DbConfig.js"
import PersonalSchema from "../schema/PersonalSchema.js"


export const registrarPersonal = async (req, res) => {  //controlador de alta

    const { nombre, apellido, fechaNac, dni, email, telefono, password, rol } = req.body

    const repo = AppDataSource.getRepository(PersonalSchema)

    const nuevoPersonal = repo.create({ nombre, apellido, fechaNac, dni, email, telefono, password, rol })
    await repo.save(nuevoPersonal)

    res.json({ ok: true, mensaje: "Personal registrado correctamente" })

}

export const validarDniUnico = async (req, res) => {  //controlador de validacion de dni

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

export const validarCorreoUnico = async (req, res) => {   //controlador de validacion de correo

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


export const obtenerPersonal = async(req, res) => { //controlador para traer todos los registros de la tabla personal

    const repo = AppDataSource.getRepository(PersonalSchema)
    const personal = await repo.find()
    res.json(personal)

}


export const bajaPersonal = async (req, res) => { //controlador de baja de personal

    const { id } = req.params

    const repo = AppDataSource.getRepository(PersonalSchema)

    await repo.delete(id)

    res.json({ ok: true, mensaje: "se eliminó el personal" })

}


