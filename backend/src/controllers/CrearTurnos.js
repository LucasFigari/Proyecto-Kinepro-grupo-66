// turnoService.js
import { AppDataSource } from './data-source.js'; // Tu configuración de TypeORM
import { Turno } from './entities/Turno.js';     // Tu entidad de Turno

export async function generarTurnosParaUnDia(fecha) {
    const turnoRepository = AppDataSource.getRepository(Turno);
    const turnosACrear = [];

    // Opcional: Si no trabajas fines de semana, saltamos Sábado (6) o Domingo (0)
    const diaDeLaSemana = fecha.getDay();
    if (diaDeLaSemana === 0 || diaDeLaSemana === 6) {
        console.log(`[Turnos] ${fecha.toDateString()} es fin de semana. No se generan turnos.`);
        return;
    }

    // Configura aquí las horas en las que quieres que se creen turnos para ese día
    const horasDisponibles = [9, 10, 11, 12, 14, 15, 16, 17]; 

    for (const hora of horasDisponibles) {
        const nuevoTurno = new Turno();
        
        // Creamos la fecha y hora exacta combinando el día con la hora del bucle
        const fechaHora = new Date(fecha);
        fechaHora.setHours(hora, 0, 0, 0); 

        nuevoTurno.fechaHora = fechaHora;
        nuevoTurno.estado = 'disponible';
        nuevoTurno.usuario = null; // Nacen en null por tu regla de negocio

        turnosACrear.push(nuevoTurno);
    }

    // Guardamos todo el bloque de turnos en la base de datos
    if (turnosACrear.length > 0) {
        await turnoRepository.save(turnosACrear);
        console.log(`[Turnos] Se generaron exitosamente los turnos para el día: ${fecha.toLocaleDateString()}`);
    }
}