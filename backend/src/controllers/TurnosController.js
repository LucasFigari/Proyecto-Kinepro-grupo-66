import AppDataSource from "../config/DbConfig.js";
import { SendEmailUseCase } from "../password/SendEmailUseCase.js";

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
        const usuarioRepository = AppDataSource.getRepository("Usuario");

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

        try {
            const listaRepo = AppDataSource.getRepository("ListaEspera");
            const turnoConArea = await turnoRepository.findOne({
                where: { id: idTurno },
                relations: ["area"]
            });

            if (turnoConArea?.area) {
                const enLista = await listaRepo
                    .createQueryBuilder("le")
                    .innerJoin("le.turno", "t")
                    .innerJoin("t.area", "a")
                    .where("le.id_usuario = :idUsuario", { idUsuario: parseInt(idUsuario) })
                    .andWhere("a.id = :areaId", { areaId: turnoConArea.area.id })
                    .getOne();

                if (enLista) {
                    await listaRepo.remove(enLista);
                    console.log("✅ Usuario removido de lista de espera del área");
                }
            }
        } catch (listaError) {
            console.error("⚠️ No se pudo remover de lista de espera:", listaError);
        }

        try {
            const usuario = await usuarioRepository.findOneBy({ id: parseInt(idUsuario) });
            if (usuario?.email) {
                const sendEmail = new SendEmailUseCase();
                const asunto = `Confirmación de Reserva - Turno N° ${turno.id}`;
                const mensaje = `Hola ${usuario.nombre}, tu turno fue reservado con éxito. Número de turno: ${turno.id}.`;
                const html = `
                    <p>Hola <strong>${usuario.nombre}</strong>,</p>
                    <p>Tu turno fue reservado con éxito.</p>
                    <p><strong>Número de Turno:</strong> ${turno.id}</p>
                    <p>¡Muchas gracias!</p>
                `;
                await sendEmail.executeConHtml(usuario.email, asunto, mensaje, html);
            }
        } catch (emailError) {
            console.error("⚠️ No se pudo enviar el email:", emailError);
        }

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

        if(!idUsuario || isNaN(parseInt(idUsuario))){
            return{ ...t, enListaEspera:false }
        }

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