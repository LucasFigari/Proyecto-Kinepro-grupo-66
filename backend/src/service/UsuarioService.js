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

}