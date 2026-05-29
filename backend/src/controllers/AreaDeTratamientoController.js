import TurnoSchema from "../schema/TurnosSchema.js"
export class AreaDeTratamientoController{

    constructor(areaDeTratamientoService){
        this.areaDeTratamientoService = areaDeTratamientoService;
    }

    getAreaByNombre = async (req, res) => {
        try {
            const { nombre } = req.params;
            const area = await this.areaDeTratamientoService.findAreaByNombre(nombre);
            if(!area){
                return res.status(404).json({
                    detalles: "Not_Found"
                });
            }
            return res.status(200).json(area);
        } catch (error) {
            return res.status(500).json({ detalles: error.message });
        }
    }

    saveArea = async (req, res) =>{
        try {
            const area = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion
            }

            const nuevaArea = await this.areaDeTratamientoService.save(area);
            return res.status(201).json(nuevaArea);

        } catch (error) {
            console.error("Error al registrar la area de tratamiento:", error);
            return res.status(400).json({
                detalles: error.message
            });
        }
    }

    getAll = async (req, res) => {
        try {
            const areas = await this.areaDeTratamientoService.findAll();
            return res.status(200).json(areas);
        } catch (error) {
            return res.status(500).json({ detalles: error.message });
        }    
    }

    deleteArea = async (req, res) => {
    try {
        const { idParaEliminar } = req.params;

        // verificás si tiene turnos asociados
        const turnos = await this.areaDeTratamientoService.getTurnosDeUnArea(parseInt(idParaEliminar));

        if(turnos.length > 0){
            return res.status(400).json({ 
                detalles: "No se puede eliminar el área porque tiene turnos asociados." 
            });
        }

        await this.areaDeTratamientoService.delete(idParaEliminar);
        return res.status(200).json({ 
            detalles: "Se eliminó el área." 
        });

    } catch (error) {
        return res.status(500).json({ 
            detalles: "No se pudo eliminar el área" 
        });
    }
}
   

getTurnosByArea = async (req, res) => {
    try {
        const { id } = req.params;
        const turnos = await this.areaDeTratamientoService.getTurnosDeUnArea(parseInt(id));       
        return res.status(200).json(turnos);
    } catch (error) {
        console.error("Error en el controlador al traer turnos:", error);
        return res.status(500).json({ error: "Error interno al recuperar los turnos." });
    }
}

    reservarCupoDeArea = async ( req, res) =>{
        try{
        
        const {nombreArea} = req.body

        if (!nombreArea){
            return res.status(400).json({ detalles: "falta especificar nombre area"});
        }
        const areaAct = await this.areaDeTratamientoService.reservarCupo(nombreArea);
        return res.status(200).json({
            mensaje: "Cupo reservado con éxito",
            area: areaAct
        });
        } catch (error) {
            return res.status(400).json({
                detalles: error.message
            })
        }
    }
}