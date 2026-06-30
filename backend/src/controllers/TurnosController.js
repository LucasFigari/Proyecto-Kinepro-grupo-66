import AppDataSource from "../config/DbConfig.js";
import { SendEmailUseCase } from "../password/SendEmailUseCase.js";

export const obtenerTurnosPorPaciente = async (req, res) => {
    try {
        const idPaciente = parseInt(req.params.id);
        if (isNaN(idPaciente)) return res.status(400).json([]);

        const turnoAsignadoRepository = AppDataSource.getRepository("TurnoAsignado");

        const asignaciones = await turnoAsignadoRepository.find({
            where: { idUsuario: idPaciente, estado: "reservado" },  // ← columna directa, no relación anidada
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

        // ← validar si ya tiene turno en el mismo área
        const turnoConArea = await turnoRepository.findOne({
            where: { id: parseInt(idTurno) },
            relations: ["area"]
        });

        if (turnoConArea?.area) {
            const yaEnArea = await turnoAsignadoRepository
                .createQueryBuilder("ta")
                .innerJoin("ta.turno", "t")
                .innerJoin("t.area", "a")
                .where("ta.idUsuario = :idUsuario", { idUsuario: parseInt(idUsuario) })
                .andWhere("a.id = :areaId", { areaId: turnoConArea.area.id })
                .getOne();

            if (yaEnArea) {
                return res.status(400).json({ error: 'Ya tenés un turno reservado en esta área.' });
            }
        }

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

export const cancelarTurnoComoCliente = async (req, res) => {

    try{
        const { idTurno, idUsuario } = req.body;

        const turnoRepo = AppDataSource.getRepository("Turno");
        const asignadoRepo = AppDataSource.getRepository("TurnoAsignado");
        const listaRepo = AppDataSource.getRepository("ListaEspera");

        const turno = await turnoRepo.findOneBy({ id: parseInt(idTurno) })
        if(!turno){
            return res.status(404).json({ ok: false, mensaje:"El turno no existe" });
        }

        //Valido que falten más de 4 horas
        const ahora = new Date();
        const fechaHoraTurno = new Date(`${turno.fecha_turno}T${turno.hora_comienzo}`)
        const diferenciaHoras = (fechaHoraTurno - ahora) / (1000 * 60 * 60)
        if(diferenciaHoras < 4){
            return res.status(400).json({ ok: false, mensaje: "Solo se pueden cancelar turnos si faltan más de 4 horas" })
        }

        const inscripcion = await asignadoRepo.findOne({ 
            where: { idTurno: parseInt(idTurno), idUsuario: parseInt(idUsuario) }
        });
        if(!inscripcion){
            return res.status(404).json({ ok: false, mensaje: "No estas inscripto en este turno" });
        }

        //Elimino de forma lógica la inscripcion y aumento cupos disponibles
        inscripcion.estado = "cancelado";
        await asignadoRepo.save(inscripcion);
        turno.cupos_ocupados -= 1;
        await turnoRepo.save(turno);

        //Mover al primero de la lista de espera
        const primeroEnEspera = await listaRepo.findOne({
            where: { turno: {id: parseInt(idTurno)} },
            relations: ["usuario"],
            order: { orden: "ASC" }
        });

        if(primeroEnEspera){

            //Anotarlo al turno
            const nuevaInscripcion = asignadoRepo.create({
                idTurno: parseInt(idTurno),
                idUsuario: primeroEnEspera.usuario.id,
                estado: "reservado"
            })
            await asignadoRepo.save(nuevaInscripcion);

            //Incrementar cupos ocupados y eliminar al que se va de la lista de espera
            turno.cupos_ocupados += 1;
            await turnoRepo.save(turno);
            await listaRepo.remove(primeroEnEspera)

            //Notificarle por mail, en caso de que el mail no funcione, no debe romper con el flujo principal
            try{
                const { SendEmailUseCase } = await import("../password/SendEmailUseCase.js");
                const sendEmail = new SendEmailUseCase();
                await sendEmail.executeConHtml(
                    primeroEnEspera.usuario.email,
                    `Confirmación de Reserva - Turno N° ${idTurno}`,
                    `Tu turno fue confirmado`,
                    `<p>Hola ${primeroEnEspera.usuario.nombre}, se liberó un cupo y fuiste anotado automáticamente al turno N° ${idTurno}. ¡Te esperamos!</p>`
                );
            }catch(error){
                console.error("Error al enviar mail:", error.message)
            }
        }

        return res.status(200).json({ ok:true, mensaje: "Turno cancelado exitosamente" })

    }catch(error){
        console.error("Error al cancelar turno: ", error.message)
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" })
    }
}

export const obtenerTurnosCanceladosPorPaciente = async (req, res) => {
    try{
        const idPaciente = parseInt(req.params.id)
        if(isNaN(idPaciente)) return res.status(400).json([]);

        const turnoAsignadoRepository = AppDataSource.getRepository("TurnoAsignado");
        const asignaciones = await turnoAsignadoRepository.find({
            where: { idUsuario: idPaciente, estado: "cancelado" },
            relations: ["turno", "turno.area"]
        })

        return res.status(200).json(asignaciones);

    }catch(error){
        console.error("Error: ", error);
        return res.status(500).json([]);
    }
}

export const cancelarTurnoConListaEspera = async (req, res) => {
    try {
        const { idTurno, idUsuario } = req.body;

        const turnoRepo = AppDataSource.getRepository("Turno");
        const asignadoRepo = AppDataSource.getRepository("TurnoAsignado");
        const listaRepo = AppDataSource.getRepository("ListaEspera");

        const turno = await turnoRepo.findOneBy({ id: parseInt(idTurno) });
        if (!turno) {
            return res.status(404).json({ ok: false, mensaje: "El turno no existe." });
        }

        const ahora = new Date();
        const fechaHoraTurno = new Date(`${turno.fecha_turno}T${turno.hora_comienzo}`);
        const diferenciaHoras = (fechaHoraTurno - ahora) / (1000 * 60 * 60);
        if (diferenciaHoras < 4) {
            return res.status(400).json({ 
                ok: false, 
                mensaje: "Cancelación fallida: Solo se pueden cancelar los turnos si faltan más de 4 horas." 
            });
        }

        const inscripcion = await asignadoRepo.findOne({ 
            where: { idTurno: parseInt(idTurno), idUsuario: parseInt(idUsuario) }
        });
        if (!inscripcion) {
            return res.status(404).json({ ok: false, mensaje: "Se cancela la operación: El cliente no posee el turno asignado." });
        }

        inscripcion.estado = "cancelado";
        await asignadoRepo.save(inscripcion);
        
        turno.cupos_ocupados -= 1;
        await turnoRepo.save(turno);

        const primeroEnEspera = await listaRepo.findOne({
            where: { turno: { id: parseInt(idTurno) } },
            relations: ["usuario"],
            order: { orden: "ASC" }
        });

        if (primeroEnEspera) {
            const nuevaInscripcion = asignadoRepo.create({
                idTurno: parseInt(idTurno),
                idUsuario: primeroEnEspera.usuario.id,
                estado: "reservado"
            });
            await asignadoRepo.save(nuevaInscripcion);

            
            turno.cupos_ocupados += 1;
            await turnoRepo.save(turno);
            
            await listaRepo.remove(primeroEnEspera);
            try {
                const { SendEmailUseCase } = await import("../password/SendEmailUseCase.js");
                const sendEmail = new SendEmailUseCase();
                await sendEmail.executeConHtml(
                    primeroEnEspera.usuario.email,
                    `¡Cupo Disponible! Confirmación de Reserva - Turno N° ${idTurno}`,
                    `Tu turno fue asignado automaticamente`,
                    `<p>Hola <strong>${primeroEnEspera.usuario.nombre}</strong>,</p>
                     <p>Se liberó un cupo para el turno de especialidad N° ${idTurno} y has sido asignado por estar en la cola de prioridad.</p>
                     <p>¡Te esperamos en KinePro!</p>`
                );
            } catch (errorMail) {
                console.error("Error al enviar mail de prioridad:", errorMail.message);
            }
        }

        return res.status(200).json({ 
            ok: true, 
            mensaje: "Cancelación exitosa. Cupo liberado y notificación enviada a la cola de prioridad." 
        });

    } catch (error) {
        console.error("Error en tu servicio de cancelación:", error.message);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
};