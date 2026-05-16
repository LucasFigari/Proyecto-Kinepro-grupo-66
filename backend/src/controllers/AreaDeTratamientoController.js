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
            await this.areaDeTratamientoService.delete(idParaEliminar);
            return res.status(200).json({ 
                detalles: "Se elimino el area." 
            });

        } catch (error) {

            return res.status(500).json({ 
                detalles: "No se pudo eliminar el area" });
        }

    }
}