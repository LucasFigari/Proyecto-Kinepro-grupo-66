export class TurnoAsignadoRepository{

    constructor(repository){
        this.repository = repository;
    }

    async guardar(idTurno, idUsuario, estado){
        return await this.repository.save({
                idUsuario: idUsuario,
                idTurno: idTurno,
                estado: estado
            });
    }

    async existeTurnoAsignadoAPaciente(idTurno, idUsuario){
        const resultado = await this.repository.findOne({
            where: {
                idTurno: idTurno,
                idUsuario: idUsuario 
            }
        });

        return resultado !== null;
    }

    async actualizar(turnoAsignado){
        return await this.repository.save(turnoAsignado);
    }

    async obtenerTurnoAsignadoAPaciente(idTurno, idUsuario) {
    return await this.repository.findOne({
        where: {
            idTurno: idTurno,
            idUsuario: idUsuario 
        }
    });
}
}