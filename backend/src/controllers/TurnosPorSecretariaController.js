import { pagoEfectivo } from "../mercado-pago/PaymentController.js";

export class TurnosPorSecretariaController{

    constructor(turnoRepository, pacienteRepository, turnoAsignadoRepository, pagoRepository, sendEmail){
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
        this.turnoAsignadoRepository = turnoAsignadoRepository;
        this.sendEmail = sendEmail;
        this.pagoRepository = pagoRepository;
    }

    guardarTurno = async (req, res) => {
        return await this.turnoRepository.guardar(req.turno);
    }

    actualizarPacienteDeUnTurnoDado = async (req, res) => {
        try {
            const { idTurno, dni } = req.body; 

            if (!idTurno || !dni) {
                return res.status(400).json({ error: 'Faltan datos requeridos (idTurno o dni)' });
            }

            const nuevoPaciente = await this.pacienteRepository.findByDni(dni);
            
            if (!nuevoPaciente) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }

            const turno = await this.turnoRepository.buscarPorId(idTurno);
            
            if (!turno) {
                return res.status(404).json({ error: 'Turno no encontrado' });
            }

            turno.usuario = nuevoPaciente;
            turno.estado = "reservado";

            const turnoActualizado = await this.turnoRepository.guardar(turno);
            
            await this.enviarCorreoDeTurnoReservado(turnoActualizado.id, turnoActualizado.usuario.email);

            return res.status(200).json({ 
                mensaje: `Turno reservado con éxito, Nro Turno es: ${turnoActualizado.id}`,
                turno: turnoActualizado 
            });

        } catch (error) {
            console.error("Error en actualizarPacienteDeUnTurnoDado:", error);
            return res.status(500).json({ error: 'Hubo un error interno en el servidor' });
        }
    }

    actualizarEstadoDeTurno = async (req, res) => {
        return await this.turnoRepository.actualizarEstadoDeTurno(req.idTurno, req.estadoDeTurno);
    }

    obtenerTurnosDisponibles = async (req, res) => {
        const turnos = await this.turnoRepository.obtenerTurnosDisponibles();
        return res.status(200).json(turnos);
    }

    obtnerPrecioDeTurno = async (req, res) => {
        try {
            const {idTurno} = req.params;
            const precio = await this.calcularPrecio(idTurno);
            return res.status(200)
                        .json({ precio: Number(precio) });
        } catch (error) {
            return res.status(500)
                    .json({ error: 'Hubo un error interno en el servidor' });
        }
    }

    enviarCorreoDeTurnoReservado = async (idTurno, email, idUsuario) => {
        /*const asunto = `Confirmación de Reserva - Turno N° ${idTurno}`;

        const urlPago = new URL('http://localhost:5173/pago-online.html');
        urlPago.searchParams.append('idTurno', idTurno);
        urlPago.searchParams.append('idUsuario', idUsuario);
        
        const urlFinal = urlPago.toString(); 

        const mensajeTexto = `Hola, tu turno ha sido reservado con éxito. Tu Número de Turno es: ${idTurno}. Puedes realizar el pago en el siguiente enlace: ${urlFinal}`;

        const plantillaHTML = `
            <p>Hola,</p>
            <p>Tu turno ha sido reservado con éxito.</p>
            <p><strong>Número de Turno:</strong> ${idTurno}</p>
            <p>Para abonar el servicio, tienes las siguientes opciones:</p>
            <ul>
                <li>Para abonar, haz <a href="${urlFinal}">clic aquí</a>.</li>
            </ul>
            <p style="margin-top: 15px;">¡Muchas gracias!</p>
        `;*/
        try {
            const asunto = `Confirmación de Reserva - Turno N° ${idTurno}`;

            const mensajeTexto = `Hola, tu turno ha sido reservado con éxito. Tu Número de Turno es: ${idTurno}.`;

            const plantillaHTML = `
                <p>Hola,</p>
                <p>Tu turno ha sido reservado con éxito.</p>
                <p><strong>Número de Turno:</strong> ${idTurno}</p>
                <ul>
                    <li>Para abonar, acercarse al centro</li>
                </ul>
                <p style="margin-top: 15px;">¡Muchas gracias!</p>
            `;

            await this.sendEmail.executeConHtml(
                email, 
                asunto, 
                mensajeTexto,  
                plantillaHTML  
            );
        } catch (error) {
            console.error(`[Error Crítico] Falló el envío de email para el turno ${idTurno}:`, error);
            throw new Error(`No se pudo enviar el correo de confirmación`);
        }
    }

    agregarUsuarioATurno = async (req, res) => {

        try {
            const { idTurno, dniUsuario } = req.body; 

            const turno = await this.turnoRepository.buscarPorId(idTurno);
            const usuario = await this.pacienteRepository.buscarPorDni(dniUsuario);


            if (!turno) {
                return res.status(404).json({ error: 'El turno no existe.' });
            }


            if (!usuario) {
                return res.status(404).json({ error: 'El usuario no existe.' });
            }
            
            if (turno.cupos_ocupados >= turno.cupo_maximo) {
                return res.status(400).json({ error: 'No hay cupos disponibles para este turno.' });
            }

            if(await this.turnoAsignadoRepository.existeTurnoAsignadoAPaciente(turno.id, usuario.id)){
                return res.status(400).json({ error: 'EL usuario ya esta registrado en el turno elegido' });
            }

            await this.turnoAsignadoRepository.guardar(turno.id, usuario.id, "reservado");

            
            turno.cupos_ocupados += 1;
            const turnoActualizado = await this.turnoRepository.guardar(turno);

            
            await this.enviarCorreoDeTurnoReservado(turnoActualizado.id, usuario.email, usuario.id);
                
            return res.status(200).json({ 
                mensaje: `Usuario asignado con éxito, Nro de turno: ${turnoActualizado.id}`,
                turno: turnoActualizado.id 
            });
        } catch (error) {
            return res.status(500)
                    .json({ error: `${error.message}` });
        }
    }

    registrarPagoDeTurno = async (req, res) => {
        try {
            const { idTurno, dni} = req.body; 

            const turno = await this.turnoRepository.buscarPorId(idTurno);
            const usuario = await this.pacienteRepository.buscarPorDni(dni);


            if (!turno) {
                return res.status(404).json({ error: 'El turno no existe.' });
            }


            if (!usuario) {
                return res.status(404).json({ error: 'El usuario no existe.' });
            }
            
            const turnoAsignado = await this.turnoAsignadoRepository.obtenerTurnoAsignadoAPaciente(turno.id, usuario.id);

            if (!turnoAsignado) {
                return res.status(404).json({ error: 'El paciente no tiene este turno asignado' });
            }

            if (turnoAsignado.estado === "pagado") {
                return res.status(400).json({ error: 'El pago del turno ya se realizó' });
            }

            turnoAsignado.estado = "pagado";
            //await pagoEfectivo(turno.id, usuario.id);
            const turnoActualizado = await this.turnoAsignadoRepository.actualizar(turnoAsignado);
                
            return res.status(200).json({ 
                mensaje: `Se registro el pago con éxito, Nro de turno: ${turnoActualizado.idTurno}, Dni del paciente: ${usuario.dni}`,
                turno: turnoActualizado.id 
            });
        } catch (error) {
            return res.status(500)
                    .json({ error: `No se puedo realizar el pago ${error.message}`});
        }
    }

    calcularPrecio = async(idTurno) => {
        let precio = await this.turnoRepository.obtenerPrecioDeTurnoPorId(idTurno);
        const diaActual = new Date().getDate();
        if (diaActual >= 14 && diaActual <= 16) {
            precio = precio - (precio * 0.2);
        }
        return precio;
    }

    crearTurno = async (req, res) => {
        try{
            const {fecha_turno, hora_comienzo, hora_fin, precio, cupo_maximo, idArea} = req.body;

            if(!fecha_turno || !hora_comienzo || !hora_fin || !precio || !cupo_maximo || !idArea){
                return res.status(400).json({ ok:false, mensaje: "Debe completar todos los campos"})
            }

            if(hora_comienzo >= hora_fin){
                return res.status(400).json({ ok:false, mensaje: "El formato del horario es inválido"});
            }

            const turnoExistente = await this.turnoRepository.existeTurno(fecha_turno, hora_comienzo, hora_fin, idArea);
            if(turnoExistente){
                return res.status(400).json({ ok:false, mensaje: "Ya existe un turno con esa fecha y rango horario en esta área"})
            }

            const turno = await this.turnoRepository.crearTurno(fecha_turno, hora_comienzo, hora_fin, precio, cupo_maximo, idArea);
            return res.status(201).json({ ok:true, mensaje: "Turno creado exitosamente", turno })

        }catch(error){
            console.log("Error al crear un turno: ", error.message)
            return res.status(500).json({ ok:false, mensaje: "Hubo un error en el servidor" })
        }
    }

    eliminarTurno = async(req, res) => {

        try{
            const {id} = req.params;
            const resultado = await this.turnoRepository.eliminarTurno(id);
            if(resultado.ok){
                return res.status(200).json(resultado)
            }else{
                return res.status(400).json(resultado)
            }
        }catch(error){
            return res.status(500).json({ ok:false, mensaje: "Error interno del servidor" })
        }

    }
}

export const calcularPrecioConMonto = async (monto) => {
        let precio = monto;
        const diaActual = new Date().getDate();
        if (diaActual >= 14 && diaActual <= 16) {
            precio = precio - (precio * 0.2);
        }
        return precio;
    };