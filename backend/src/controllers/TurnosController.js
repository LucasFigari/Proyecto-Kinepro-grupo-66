import AppDataSource from "../config/DbConfig.js";

export const obtenerTurnosPorPaciente = async (req, res) => {
    try {
        const idPaciente = parseInt(req.params.id);

        if (isNaN(idPaciente)) {
            return res.status(400).json([]); // Devolvemos array vacío para evitar que rompa el front
        }
        
        const turnoRepository = AppDataSource.getRepository("Turno");

        // Hacemos la consulta a la base de datos
        const turnos = await turnoRepository.find({
            where: {
                usuario: { id: idPaciente }
            },
            relations: ["area"] 
        });

        // Retornamos SIEMPRE un JSON, aunque sea un array vacío
        return res.status(200).json(turnos || []);

    } catch (error) {
        // Mirá la consola negra de Node para ver qué dice este log detallado:
        console.error("❌ Error real en Postgres/TypeORM:", error);
        
        // Devolvemos un JSON de error estructurado en lugar de romper el servidor
        return res.status(500).json([]);
    }
};