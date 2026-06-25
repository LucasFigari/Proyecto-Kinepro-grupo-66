import AppDataSource from "../config/DbConfig.js";

export const agregarListaEspera = async (req, res) => {
    try {
        const { idTurno, idUsuario } = req.body;

        const turnoRepo = AppDataSource.getRepository("Turno");
        const listaRepo = AppDataSource.getRepository("ListaEspera");
        const asignadoRepo = AppDataSource.getRepository("TurnoAsignado");

        const turno = await turnoRepo.findOne({
            where: { id: idTurno },
            relations: ["area"]
        });

        if (!turno) {
            return res.status(404).json({ error: "Turno no encontrado" });
        }

        const yaEnTurno = await asignadoRepo.findOne({
            where: {
                turno: { id: idTurno },
                usuario: { id: idUsuario }
            }
        });

        if (yaEnTurno) {
            return res.status(400).json({ error: "Ya estás anotado en este turno" });
        }

        const yaEnLista = await listaRepo.findOne({
            where: {
                turno: { id: idTurno },
                usuario: { id: idUsuario }
            }
        });

        if (yaEnLista) {
            return res.status(400).json({ error: "Ya estás en lista de espera" });
        }

        const conflictoTurno = await asignadoRepo
            .createQueryBuilder("ta")
            .innerJoin("ta.turno", "t")
            .where("ta.idUsuario = :idUsuario", { idUsuario })
            .andWhere("t.areaId = :areaId", { areaId: turno.area.id })
            .getOne();

        if (conflictoTurno) {
            return res.status(400).json({
                error: "Ya tenés un turno en esta área"
            });
        }

        const conflictoLista = await listaRepo
            .createQueryBuilder("le")
            .innerJoin("le.turno", "t")
            .where("le.id_usuario = :idUsuario", { idUsuario })
            .andWhere("t.areaId = :areaId", { areaId: turno.area.id })
            .getOne();

        if (conflictoLista) {
            return res.status(400).json({
                error: "Ya estás en una lista de espera de esta área"
            });
        }

           const ultimo = await listaRepo
            .createQueryBuilder("le")
            .select("MAX(le.orden)", "max")
            .where("le.id_turno = :idTurno", { idTurno })
            .getRawOne();

        const nuevoOrden = (ultimo.max || 0) + 1;

        const nueva = listaRepo.create({
            turno: { id: idTurno },
            usuario: { id: idUsuario },
            orden: nuevoOrden
        });

        await listaRepo.save(nueva);

        return res.status(200).json({
            ok: true,
            message: "Agregado a lista de espera",
            orden: nuevoOrden
        });

    } catch (error) {
        console.error("❌ Error lista espera:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const quitarListaDeEspera = async (req, res) => {
    try {
        const { idTurno, idUsuario } = req.body;

        if (!idTurno || !idUsuario) {
            return res.status(400).json({ error: "Faltan datos requeridos." });
        }

        const listaRepo = AppDataSource.getRepository("ListaEspera");

        // 🔎 buscar registro en lista de espera
        const registro = await listaRepo.findOne({
            where: {
                turno: { id: idTurno },
                usuario: { id: idUsuario }
            },
            relations: ["turno", "usuario"]
        });

        if (!registro) {
            return res.status(404).json({
                error: "No estás en la lista de espera de este turno."
            });
        }

        //eliminar registro
        await listaRepo.remove(registro);

        return res.status(200).json({
            ok: true,
            message: "Te quitaste de la lista de espera correctamente"
        });

    } catch (error) {
        console.error("❌ Error quitando de lista de espera:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
export const obtenerListaEsperaPorTurno = async (req, res) => {
    try {
        const { idTurno } = req.params;

        const listaRepo = AppDataSource.getRepository("ListaEspera");

        const lista = await listaRepo.find({
            where: { turno: { id: parseInt(idTurno) } },
            relations: ["usuario"],
            order: { orden: "ASC" }
        });

        return res.status(200).json(lista);

    } catch (error) {
        console.error("❌ Error obteniendo lista de espera:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}