import { IsNull } from "typeorm";

export class TurnoRepository{

    constructor(repository){
        this.turnoRepository = repository;
    }

    async buscarPorId(id) {
        return await this.turnoRepository.findOneBy({ id: id });
    }

    async guardar(turno) {
        return await this.turnoRepository.save(turno);
    }

    async eliminar(id){
        return await this.turnoRepository.delete(id);
    }


    async agregarUsuarioATurno(idTUrno, idUsuario){
        const turno = this.buscarPorId(idTUrno);
    }
    

    async obtenerTurnosDisponibles() {
        return await this.turnoRepository.createQueryBuilder("turno")
            .leftJoinAndSelect("turno.area", "area") 
            .where("turno.cupos_ocupados < turno.cupo_maximo")            
            .orderBy("area.nombre", "ASC")
            .addOrderBy("turno.hora_comienzo", "ASC")  
            .getMany();
    }

    async obtenerPrecioDeTurnoPorId(id){
        const turno = await this.turnoRepository.findOneBy({ id: id});
        return turno.precio;
    }
}