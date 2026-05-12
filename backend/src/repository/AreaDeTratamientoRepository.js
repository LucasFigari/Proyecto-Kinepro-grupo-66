export class AreaDeTratamientoRepository{

    constructor(repository){
        this.repository = repository;
    }

    async findById(areaId){
        return await this.repository.findOneBy({ id: areaId});
    }

    async findByNombre(nombreDeArea){
        return await this.repository.findOneBy({ nombre: nombreDeArea});
    }

    async save(areaDeTratamiento){
        return await this.repository.save(areaDeTratamiento);
    }

    async delete(areaId){
        await this.repository.softDelete(areaId);
    }

    async updateDescripcion(id, nuevaDescripcion){
        const area = await this.findById(id);
        if (area){
            area.descripcion = nuevaDescripcion;
            return await this.save(area);
        }
    }

    async findAll(){
        return await this.repository.find();
    }
}