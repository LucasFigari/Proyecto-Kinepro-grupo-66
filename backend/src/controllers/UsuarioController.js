export class UsuarioController{

    constructor(UsuarioService){
        this.usuarioService = UsuarioService;
    }

    saveUsuario = async (req, res) => {
        try {
            const usuario = {
                dni: req.body.dni,
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                password: req.body.password,
                telefono: req.body.telefono
            }

            const nuevoUsuario = await this.usuarioService.saveUsuario(usuario);
            return res.status(201).json(nuevoUsuario);
        } catch (error) {
            console.error("Error al registrar al Usuario:", error.message);

            if (error.message === "DNI_DUPLICADO" || error.message === "EMAIL_DUPLICADO") {
                return res.status(409).json({ detalles: error.message });
            }

            return res.status(400).json({
                detalles: error.message || "Error inesperado en el registro"
            });
        }
    }
}