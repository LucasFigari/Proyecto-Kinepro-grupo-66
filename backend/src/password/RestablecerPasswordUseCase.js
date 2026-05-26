export class RestablecerPasswordUseCase{

    constructor(passwordResetRepository, encriptarPassword, userRepository){
        this.passwordResetRepository = passwordResetRepository;
        this.encriptarPasswordUseCase = encriptarPassword;
        this.usuarioRepository = userRepository;

    }

    execute = async(req, res) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            const resetRequest = await this.passwordResetRepository.findByToken(token);
            
            if (!resetRequest) {
            return res.status(400).json({ status: 'error', message: 'El token es inválido o ha expirado.' });
            }
            
            const userAlmacenado = await this.usuarioRepository.findById(resetRequest.user_id);

            userAlmacenado.password = newPassword; 

            await this.passwordResetRepository.delete(resetRequest.user_id);

            await this.usuarioRepository.save(userAlmacenado);

            return res.json({ status: 'success', message: 'Tu contraseña ha sido actualizada con éxito.' });

        } catch (error) {
            console.error("Error al reestablecer la contraseña:", error);

            return res.status(500).json({ 
                status: 'error', 
                message: 'Hubo un problema al procesar tu solicitud.' 
            });
        }
    
    }
}