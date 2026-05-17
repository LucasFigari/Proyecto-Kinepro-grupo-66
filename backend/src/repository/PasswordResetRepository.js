import { MoreThan } from "typeorm";

export class UsuarioRepository {

    constructor(passwordResetRepository) {
        this.repository = passwordResetRepository;
    }

    async findById(id) {
        return await this.repository.findOneBy({ id: id });
    }

    async findByUserId(id) {
        return await this.repository.findOneBy({ user_id: id });
    }

    async save(passwordReset) {
        return await this.repository.save(passwordReset);
    }

    async delete(user_id){
        return await this.repository.delete({ user_id: user_id});
    }

    async findByToken(token){
        return await this.repository.findOneBy({
            where: {
                token: token,
                expires_at: MoreThan(Date.now())
            }
        });
    }
}