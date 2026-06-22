import AppDataSource from "../config/DbConfig.js";

export const obtenerTurnosPorPaciente = async (req, res) => {
    try {
        const idPaciente = parseInt(req.params.id);
        if (isNaN(idPaciente)) return res.status(400).json([]);

        const turnoAsignadoRepository = AppDataSource.getRepository("TurnoAsignado");

        const asignaciones = await turnoAsignadoRepository.find({
            where: { idUsuario: idPaciente },  // ← columna directa, no relación anidada
            relations: ["turno", "turno.area"]  // ← trae el turno y su área
        });

        const turnos = asignaciones.map(a => a.turno);
        return res.status(200).json(turnos);

    } catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json([]);
    }
};
export const reservarTurnoComoPaciente = async (req, res) => {
    try {
        const { idTurno, idUsuario } = req.body; 

        if (!idTurno || !idUsuario) {
            return res.status(400).json({ error: 'Faltan datos requeridos.' });
        }
        
        const turnoRepository = AppDataSource.getRepository("Turno");
        const turnoAsignadoRepository = AppDataSource.getRepository("TurnoAsignado");

        const turno = await turnoRepository.findOneBy({ id: idTurno });
        if (!turno) return res.status(404).json({ error: 'El turno no existe.' });
        
        if (turno.cupos_ocupados >= turno.cupo_maximo) {
            return res.status(400).json({ error: 'No hay cupos disponibles.' });
        }

        const yaAsignado = await turnoAsignadoRepository.findOne({
            where: { 
                idTurno: parseInt(idTurno), 
                idUsuario: parseInt(idUsuario) 
            }
        });
        
        if (yaAsignado) return res.status(400).json({ error: 'Ya estás registrado en este turno.' });

        const nuevaAsignacion = turnoAsignadoRepository.create({
            idTurno: parseInt(idTurno),
            idUsuario: parseInt(idUsuario),
            estado: "reservado"
        });
        await turnoAsignadoRepository.save(nuevaAsignacion);

        turno.cupos_ocupados += 1;
        await turnoRepository.save(turno);

        return res.status(200).json({ mensaje: '¡Reserva realizada con éxito!' });

    } catch (error) {
        console.error("❌ Error en reservarTurnoComoPaciente:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerTurnosDisponiblesPorArea = async (req, res) => {
    try {
        const listaRepo = AppDataSource.getRepository("ListaEspera");
        const { idArea } = req.params;
        const turnoRepository = AppDataSource.getRepository("Turno");

        const turnosFiltrados = await turnoRepository.find({
            where: {
                area: { id: parseInt(idArea) }  // ← objeto anidado, no areaId
            },
            relations: ["area"],                  // ← obligatorio para que el where funcione
            order: {
                fecha_turno: "ASC",
                hora_comienzo: "ASC"
            }
        });

        const idUsuario = req.query.idUsuario;

        const turnosConLista = await Promise.all(
            turnosFiltrados.map(async (t) => {

                const enLista = await listaRepo.findOne({
                    where: {
                        turno: { id: t.id },
                        usuario: { id: parseInt(idUsuario) }
                    }
                });

                return {
                    ...t,
                    enListaEspera: !!enLista
                };
            })
        );

        return res.status(200).json(turnosConLista);

    } catch (error) {
        console.error("❌ Error al obtener turnos por área:", error);
        return res.status(500).json({ error: 'Error al cargar la agenda.' });
    }
};