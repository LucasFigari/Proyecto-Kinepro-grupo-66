export class TurnoService {
    constructor(turnoRepository, areaDeTratamientoService) {
        this.turnoRepository = turnoRepository;
        this.areaDeTratamientoService = areaDeTratamientoService; // Tu servicio actual
    }

    async crearNuevoTurno(datosDelTurno) {

        const nuevoTurno = await this.turnoRepository.save(datosDelTurno);

 
        await this.areaDeTratamientoService.aumentarContadorCupo(datosDelTurno.nombreArea);

        return nuevoTurno;
    }
}