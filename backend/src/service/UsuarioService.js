export class UsuarioService{

    constructor(userRepository, encriptarPassword){
        this.usuarioRepository = userRepository;
        this.encriptarPasswordUseCase = encriptarPassword;
    }

    async saveUsuario(usuario){
        const existeDni = await this.usuarioRepository.findByDni(usuario.dni);
        if (existeDni) {
            throw new Error("DNI_DUPLICADO");
        }

        const existeEmail = await this.usuarioRepository.findByEmail(usuario.email);
        if (existeEmail) {
            throw new Error("EMAIL_DUPLICADO");
        }

        usuario.password =  await this.encriptarPasswordUseCase.execute(usuario.password);

        return await this.usuarioRepository.save(usuario);
    }

}