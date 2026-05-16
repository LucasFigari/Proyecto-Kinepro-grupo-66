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
        try {
            return await this.repository.save(areaDeTratamiento);

        } catch (error) {
            throw new Error("El area ingresada ya existe");

        }
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

    async deleteByNombre(nombreArea){
        await this.repository.softDelete( {nombre: nombreArea});
    }
}