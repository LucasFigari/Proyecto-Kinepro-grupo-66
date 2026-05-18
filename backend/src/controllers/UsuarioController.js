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

    const usuarioExistente = await repo.findOne({ where: { email: email } })

    if(usuarioExistente){
        res.json({ existe: true })
    }
    else{
        res.json({ existe: false })
    }
}

export const buscarPaciente = async (req, res) => {
    const { busqueda } = req.params

    const repo = AppDataSource.getRepository(UserSchema)

    const pacientes = await repo
        .createQueryBuilder("usuario")
        .where("usuario.nombre ILIKE :busqueda OR usuario.apellido ILIKE :busqueda OR usuario.dni ILIKE :busqueda", 
            { busqueda: `%${busqueda}%` })
        .getMany()

    res.json(pacientes)
}
//
export const obtenerPerfil = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const repo = AppDataSource.getRepository(UserSchema); 


        const usuario = await repo.findOne({ where: { id: parseInt(id) } });

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json(usuario);
        
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
    

