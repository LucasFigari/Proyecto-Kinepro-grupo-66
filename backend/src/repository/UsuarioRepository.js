export class UsuarioRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository("Usuario");
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
}