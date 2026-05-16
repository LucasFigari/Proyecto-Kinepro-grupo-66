import AppDataSource from "../config/DbConfig.js";
import UsuarioSchema from "../schema/UsuarioSchema.js";
import PersonalSchema from "../schema/PersonalSchema.js";

export const login = async (req, res) => {
    const {dni, password} = req.body;

    const usuarioRepo = AppDataSource.getRepository(UsuarioSchema);
    const personalRepo = AppDataSource.getRepository(PersonalSchema);

    //Consulta en la BD de usuarios
    const usuario = await usuarioRepo.findOne({where: {dni}});
    if(usuario){
        if(usuario.password !== password){
            return res.json({ok:false, mensaje: "El DNI o la contraseña son incorrectos"})
        }
        return res.json({ok:true, rol: "usuario", datos: usuario})
    }

    //Consulta en la BD de personal
    const personal = await personalRepo.findOne({where: {dni}});
    if(personal){
        if(personal.password !== password){
            return res.json({ok:false, mensaje: "El DNI o la contraseña son incorrectos"})
        }
        return res.json({ok:true, rol: personal.rol, datos: personal})
    }

    //Si no hay ningun usuario con ese DNI:
    return res.json({ok:false, mensaje: "El DNI o la contraseña son incorrectos"});
}