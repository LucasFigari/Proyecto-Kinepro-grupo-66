export class UsuarioService{

    constructor(userRepository, encriptarPassword){
        this.usuarioRepository = userRepository;
        this.encriptarPasswordUseCase = encriptarPassword;
    }

    async saveUsuario(usuario){
        const existeDni = await this.usuarioRepository.findByDni(usuario.dni);
        if (existeDni) {
            throw new Error("El DNI ingresado ya se encuentra registrado.");
        }

        const existeEmail = await this.usuarioRepository.findByEmail(usuario.email);
        if (existeEmail) {
            throw new Error("El EMAIL ingresado ya se encuentra registrado.");
        }

        usuario.password =  await this.encriptarPasswordUseCase.execute(usuario.password);

        return await this.usuarioRepository.save(usuario);
    }

    async eliminarUsuarioPorId(id){
        const idNUm = paraseInt(id);

        const usuario = await this.usuarioRepository.findById(idNUm);

        if (!usuario){
            throw new Error("usuario no existente! ");
        }
        return await this.usuarioRepository.delete(idNUm);
    }

}