export class AreaDeTratamientoService{

    constructor(areaDeTratamientoRepository){
        this.areaDeTratamientoRepository= areaDeTratamientoRepository;
    }

    async save(areaDeTratamiento){
        const existeArea = await this.areaDeTratamientoRepository.findByNombre(areaDeTratamiento.nombre);
        if(existeArea){
            throw new Error("El nombre de area ingresado ya esta registrado.");
        }
        return await this.areaDeTratamientoRepository.save(areaDeTratamiento);
    }

    async findAll(){
        return await this.areaDeTratamientoRepository.findAll();
    }

    async findAreaByNombre(nombre){
        return await this.areaDeTratamientoRepository.findByNombre(nombre);
    }

    async delete(id){
        try {
            await this.areaDeTratamientoRepository.delete(id);
        } catch (error) {
            throw new Error("No se puedo eliminar el area.")
        }
    }
    async getTurnosDeUnArea(areaId) {
    return await this.areaDeTratamientoRepository.findTurnosByAreaId(areaId);
}
    //logica de cupos del area
    async reservarCupo(nombreArea){
        const area = await this.areaDeTratamientoRepository.findByNombre(nombreArea);

        if (!area){
            throw new Error("el area de tratamiento no existe");
        }

        if (area.cupoOcupados >= area.cupoMaximo){
            throw new Error("no hay cupo disponible en " + nombreArea + ".");
        }

        area.cupoOcupados += 1;

        return await this.areaDeTratamientoRepository.save(area); 
    }

}