export class CrearUsuariouseCase{

    constructor(usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }
    async execute(datosEntrada){
        const existeDni = await this.usuarioRepository.findByDni(datosEntrada.dni);
        if (existeDni) {
            throw new Error("DNI_DUPLICADO");
        }

        const existeEmail = await this.usuarioRepository.findByEmail(datosEntrada.email);
        if (existeEmail) {
            throw new Error("EMAIL_DUPLICADO");
        }
        
        return await this.usuarioRepository.save(datosEntrada);
    }
}