export class TurnosPorSecretariaController{

    constructor(turnoRepository, pacienteRepository, turnoAsignadoRepository, sendEmail){
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
        this.turnoAsignadoRepository = turnoAsignadoRepository;
        this.sendEmail = sendEmail;
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
            const {idTurno} = req.paramsconst;
            const precio = await this.turnoRepository.obtenerPrecioDeTurnoPorId(idTurno);
            return res.status(200)
                        .json({ precio: Number(precio) });
        } catch (error) {
            return res.status(500)
                    .json({ error: 'Hubo un error interno en el servidor' });
        }
    }

    enviarCorreoDeTurnoReservado = async (idTurno, email) => {
        const asunto = `Confirmación de Reserva - Turno N° ${idTurno}`;

        const mensajeTexto = `Hola, tu turno ha sido reservado con éxito. Tu Número de Turno es: ${idTurno}. Puedes realizar el pago en el siguiente enlace: http://localhost:5173/seleccion-de-pago.html`;

        const plantillaHTML = `
            <p>Hola,</p>
            <p>Tu turno ha sido reservado con éxito.</p>
            <p><strong>Número de Turno:</strong> ${idTurno}</p>
            <p>Para completar tu reserva, por favor realiza el pago ingresando aquí:</p>
            <p>
                <a href="http://localhost:5173/seleccion-de-pago.html" style="color: #00a896; font-weight: bold; text-decoration: underline;">
                    Ir a la página de pago
                </a>
            </p>
            <p>¡Muchas gracias!</p>
        `;

        await this.sendEmail.executeConHtml(
            email, 
            asunto, 
            mensajeTexto,  
            plantillaHTML  
        );
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

            await this.turnoAsignadoRepository.guardar(turno.id, usuario.id);

            turno.cupos_ocupados += 1;
            const turnoActualizado = await this.turnoRepository.guardar(turno);

            
            await this.enviarCorreoDeTurnoReservado(turnoActualizado.id, usuario.email);
                
            return res.status(200).json({ 
                mensaje: `Usuario asignado con éxito`,
                turno: turnoActualizado.id 
            });
        } catch (error) {
            return res.status(500)
                    .json({ error: `${error.message}` });
        }
    }
}