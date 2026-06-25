import AppDataSource from "../config/DbConfig.js"
import HistorialClinicoSchema from "../schema/HistorialClinicoSchema.js"

export const crearHistorial = async (req, res) => {
    const { titulo, fecha, diagnostico, idPaciente, idKinesiologo, idArea } = req.body

    const repo = AppDataSource.getRepository(HistorialClinicoSchema)

    const nuevoHistorial = repo.create({
        titulo,
        fecha,
        diagnostico,
        usuario: { id: idPaciente },
        kinesiologo: { id: idKinesiologo },
        area: { id: parseInt(idArea) }
    })

    await repo.save(nuevoHistorial)

    res.json({ ok: true, mensaje: "Historial creado correctamente" })
}

export const obtenerHistorialPorPaciente = async (req, res) => {
    const { idPaciente } = req.params

    const repo = AppDataSource.getRepository(HistorialClinicoSchema)

    const historiales = await repo.find({
        where: { usuario: { id: parseInt(idPaciente) } },
        relations: ["usuario", "kinesiologo", "area"]  // ← agregás "area"
    })

    res.json(historiales)
}


export const eliminarHistorial = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(HistorialClinicoSchema); // Asegurate de que se llame así tu entidad

        const existe = await repo.findOneBy({ id: parseInt(id) });
        if (!existe) {
            return res.status(404).json({ ok: false, mensaje: "Historial no encontrado" });
        }

        await repo.delete(id);
        return res.json({ ok: true, mensaje: "Historial eliminado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
};


export const modificarHistorial = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, fecha, diagnostico } = req.body;
        
        const repo = AppDataSource.getRepository(HistorialClinicoSchema);

        const historial = await repo.findOneBy({ id: parseInt(id) });
        if (!historial) {
            return res.status(404).json({ ok: false, mensaje: "Historial no encontrado" });
        }

        historial.titulo = titulo;
        historial.fecha = fecha;
        historial.diagnostico = diagnostico;

        
        await repo.save(historial);

        return res.json({ ok: true, mensaje: "Historial modificado con éxito" });
    } catch (error) {
        console.error("Error al editar historial:", error);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
};