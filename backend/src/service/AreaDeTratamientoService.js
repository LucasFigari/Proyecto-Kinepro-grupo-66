export class AreaDeTratamientoService{

    constructor(areaDeTratamientoRepository){
        this.areaDeTratamientoRepository= areaDeTratamientoRepository;
    }

    async save(areaDeTratamiento){
        const existeArea = await this.areaDeTratamientoRepository.findByNombre(areaDeTratamiento.nombre);
        if(existeArea){
            throw new Error("NOMBRE_DE_AREA DUPLICADO");
        }
        return await this.areaDeTratamientoRepository.save(areaDeTratamiento);
    }

    async findAll(){
        return await this.areaDeTratamientoRepository.findAll();
    }

    async findAreaByNombre(nombre){
        return await this.areaDeTratamientoRepository.findByNombre(nombre);
    }
}