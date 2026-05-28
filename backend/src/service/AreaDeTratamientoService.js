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

    /*logica de cupos del area */
async reservarCupo(nombreArea) {
    const area = await this.areaDeTratamientoRepository.findByNombre( nombreArea);
    
    if (!area) throw new Error("El área especificada no existe.");

    /* verifica si esta lleno */
    if (area.cupoOcupados >= area.cupoMaximo) {
        throw new Error("No hay cupos disponibles para esta área.");
    }

    return area;
}

/*aumenta +1 la catnidad de cupos ocupados*/
async aumentarContadorCupo(nombreArea) {
    const area = await this.areaDeTratamientoRepository.findByNombre(nombreArea);
    
    if (!area) throw new Error("No se pudo actualizar el cupo: Área no encontrada.");

    
    area.cupoOcupados = area.cupoOcupados + 1; 
    
    /* guardo en la bd*/
    return await this.areaDeTratamientoRepository.save(area); 
}

}