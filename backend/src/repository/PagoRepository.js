export class PagoRepository{
    
    constructor(repository){
        this.repository = repository;
    }

    async guardar(pago){
        return await this.repository.save(pago);
    }
}