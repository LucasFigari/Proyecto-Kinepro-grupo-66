import  bcrypt from 'bcryptjs';

export class EncriptarPasswordUseCase{

    async execute(password) {
        const passwordHasheada= bcrypt.hash(password, 10);
        return passwordHasheada;
    }
}