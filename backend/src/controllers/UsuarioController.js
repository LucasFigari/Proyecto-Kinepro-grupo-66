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

export const obtenerPerfilCliente = async(req, res) => {
   const { id } = req.params

   const repo = AppDataSource.getRepository(UserSchema);
   try{
       const usuario = await repo.findOne({where: { email: email}})

       if (usuario) {
              const { password, ...datosPublicos } = usuario;
              res.json(datosPublicos); 
       } else {
               res.status(404).json({ mensaje: "usuario encontrado" });
       }
   }catch(error){
    res.estatus(505).json({ mensaje:"usuario no encontrado"}) 
   }

}