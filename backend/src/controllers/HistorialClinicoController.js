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