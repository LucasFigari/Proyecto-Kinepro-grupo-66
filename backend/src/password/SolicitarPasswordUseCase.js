import crypto from "crypto";

export class SolicitarPasswordUseCase{

    constructor(userRepository, passwordResetRepository, sendMailUseCase){
        this.userRepository= userRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.sendMailUseCase = sendMailUseCase;
    }

    execute = async(req, res) => {
        try {
            const { email} = req.body;
            const user = await this.userRepository.findByEmail(email);

            if(!user){
                return res.status(404).json({ status: 'error', message: 'El correo no está registrado.' });
            }

            const token = crypto.randomBytes(20).toString("hex");
            const expires = new Date(Date.now() + 900000);

            const userPasswordReset = {
                user_id: user.id,
                token: token,
                expires_at: expires
            }

            await this.passwordResetRepository.save(userPasswordReset);

            const text = `Haz clic aquí para restablecer tu clave: http://localhost:3000/forgot-password/reset/${token}`;
            await this.sendMailUseCase.execute(user.email, "Recuperacion de contraseña.", text);
            
            return res.status(200).json({ 
                status: 'success', 
                message: 'Correo de recuperación enviado con éxito.' 
            });
        } catch (error) {
            console.error("Error en solicitarPassword:", error);

            return res.status(500).json({ 
                status: 'error', 
                message: 'Hubo un problema al procesar tu solicitud.' 
            });
        }
    }
}