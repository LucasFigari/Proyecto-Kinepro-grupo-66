// cron.js
import cron from 'node-cron';
import { generarTurnosParaUnDia } from './turnoService.js';

// Explicación del formato de node-cron ('segundo minuto hora día mes día_de_la_semana')
// '0 0 * * *' significa: Todos los días a las 00:00:00 (Medianoche)
cron.schedule('0 0 * * *', async () => {
    console.log('--- Iniciando tarea automática de turnos ---');
    
    try {
        // LÓGICA DE ANTICIPACIÓN: 
        // Si creamos los turnos "para hoy", tus clientes no tendrían tiempo de reservar.
        // Lo ideal es que hoy a la medianoche creemos los turnos de dentro de 15 o 30 días.
        // Así, tu agenda siempre tiene una ventana de disponibilidad flotante.
        
        const diasDeAnticipacion = 1; // Ventana de 1 mes disponible siempre
        const fechaFutura = new Date();
        fechaFutura.setDate(fechaFutura.getDate() + diasDeAnticipacion);

        await generarTurnosParaUnDia(fechaFutura);
        
    } catch (error) {
        console.error('Error ejecutando la automatización de turnos:', error);
    }
});