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

    async crearTurno(fecha_turno, hora_comienzo, hora_fin, precio, cupo_maximo, idArea) {
        const turno = this.turnoRepository.create({
            fecha_turno,
            hora_comienzo,
            hora_fin,
            precio,
            cupo_maximo,
            cupos_ocupados: 0,
            area : { id: idArea }
        });
        return await this.turnoRepository.save(turno);
    }

    async existeTurno(fecha_turno, hora_comienzo, hora_fin, idArea){
        return await this.turnoRepository.findOne({
            where: {
                fecha_turno,
                hora_comienzo,
                hora_fin,
                area: { id: idArea }
            },
            relations: ["area"]
        });
    }

    async eliminarTurno(id){
        const turno = await this.turnoRepository.findOneBy({ id: parseInt(id) });
        if(!turno){
            return { ok:false, mensaje: "El turno no existe" }
        }
        if(turno.cupos_ocupados > 0) {
            return { ok:false, mensaje: "No es posible dar de baja el turno ya que hay clientes anotados" }
        }
        await this.turnoRepository.delete(id);
        return { ok:true, mensaje: "Turno eliminado correctamente" }
    }
}