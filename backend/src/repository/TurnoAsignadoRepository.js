export class TurnoAsignadoRepository{

    constructor(repository){
        this.repository = repository;
    }

    async guardar(idTurno, idUsuario){
        return await this.repository.save({
                idUsuario: idUsuario,
                idTurno: idTurno
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

    
}