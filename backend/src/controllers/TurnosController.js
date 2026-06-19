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

        // 🛠️ CORRECCIÓN AQUÍ: Agregamos las relations para que el filtro anidado funcione bien
        const yaAsignado = await turnoAsignadoRepository.findOne({
            where: { 
                turno: { id: idTurno }, 
                usuario: { id: idUsuario } 
            },
            relations: ["turno", "usuario"] 
        });
        
        if (yaAsignado) return res.status(400).json({ error: 'Ya estás registrado en este turno.' });

        const nuevaAsignacion = turnoAsignadoRepository.create({
            turno: { id: idTurno },
            usuario: { id: idUsuario }
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

        return res.status(200).json(turnosFiltrados);
    } catch (error) {
        console.error("❌ Error al obtener turnos por área:", error);
        return res.status(500).json({ error: 'Error al cargar la agenda.' });
    }
};