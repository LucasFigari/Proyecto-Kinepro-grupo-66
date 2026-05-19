export class UsuarioRepository {
    constructor(repository) {
        this.repository = repository;
    }

    async findById(id) {
        return await this.repository.findOneBy({ id: id });
    }

    async findByDni(dni) {
        return await this.repository.findOneBy({ dni: dni });
    }

    async findByEmail(email) {
        return await this.repository.findOneBy({ email: email });
    }

    async save(usuario) {
        return await this.repository.save(usuario);
    }

    async delete(id){
        return await this.repository.delete(id);
    }
}