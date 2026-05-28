// src/controllers/UsuarioController.js
import AppDataSource from "../config/DbConfig.js"
import UserSchema from "../schema/UsuarioSchema.js"
import TurnoSchema from "../schema/TurnosSchema.js"

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

export const eliminarPerfil = async (req,res) =>{
    try {
        const { id } = req.params;

        const repo = AppDataSource.getRepository(UserSchema);

        const usuario = await repo.findOneBy({ id: parseInt(id) });

        if (!usuario){
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const repoTurnos = AppDataSource.getRepository(TurnoSchema);
        const tieneTurnos = await repoTurnos.findOne({ 
            where: { 
                usuario: { id: parseInt(id) }
            }
        });

        if (tieneTurnos) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: "No se puede eliminar el usuario porque tiene turnos asignados. Cancelalos primero." 
            });
        }
        
        await repo.delete(id);
        res.json({ ok: true, mensaje : "se elimino el cliente"})
        
    }catch (error) {
       res.status(500).json({ mensaje: "error en el servidor"})
    }
}

export const obtenerTodosUsuarios = async (req, res) => {
    try{
    const repo = AppDataSource.getRepository(UserSchema);
    const usuarios = await repo.find();
    res.json(usuarios);
    }
    catch (error){
        console.error(error);
        res.status(500).json({ mensaje: "error al traer los usuarios"});
    }
}
    
export const editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, password } = req.body;

    console.log("Datos recibidos: ", {nombre, apellido, telefono, password})

    const repo = AppDataSource.getRepository(UserSchema)

    //Valido campos vacios
    if( !nombre || !apellido || !telefono){
        return res.json({ ok: false, mensaje: "Debe completar todos los campos"})
    }

    //Valido que nombre y apellido (3-30 caracteres)
    if( nombre.length < 3 || nombre.length > 30){
        return res.json({ ok: false, mensaje: "El nombre debe tener entre 3 y 30 caracteres"})
    }
    if(apellido.length < 3 || apellido.length > 30){
        return res.json({ ok: false, mensaje: "El apellido debe tener entre 3 y 30 caracteres"})
    }

    // Validar teléfono (solo números, 7-8 dígitos)
    const telefonoRegex = /^\d{7,8}$/
    if (!telefonoRegex.test(telefono)) {
        return res.json({ ok: false, mensaje: "El teléfono debe tener entre 7 y 8 dígitos numéricos" })
    }

    //Valido contraseña si se ingreso nueva
    if( password && password.length < 6 || password.length > 12){
        return res.json({ ok: false, mensaje: "La contraseña debe tener entre 6 y 12 caracteres"})
    }

    const datosActualizar = { nombre, apellido, telefono }
    if(password) datosActualizar.password = password

    await repo.update(id, datosActualizar)
    res.json({ ok: true, mensaje: "Datos actualizados" })
}