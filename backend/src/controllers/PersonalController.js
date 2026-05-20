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

// EDICION DE DATOS DEL PERSONAL
export const editarPersonal = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, email, telefono, rol} = req.body;
    const repo = AppDataSource.getRepository(PersonalSchema);

    //Valido campos vacíos
    if(!nombre || !apellido || !dni || !email || !telefono || !rol){
        return res.json({ ok: false, mensaje: "Debe completar todos los campos"})
    }
    //Valido DNI único
    const dniExistente = await repo.findOne({ where: {dni}})
    if( dniExistente && dniExistente.id !== parseInt(id)) {
        return res.json({ ok:false, mensaje: "El DNI ya se encuentra registrado en la lista de trabajadores actuales"})
    }

    await repo.update(id, { nombre, apellido, dni, email, telefono, rol })
    res.json({ ok:true, mensaje: "Se han aplicado los cambios"})
}