import { Router } from "express";
import { RestablecerPasswordUseCase } from "../password/RestablecerPasswordUseCase.js";
import { EncriptarPasswordUseCase } from "../password/EncriptarPasswordUseCase.js";
import AppDataSource from "../config/DbConfig.js";
import { UsuarioRepository } from "../repository/UsuarioRepository.js" 
import { PasswordResetRepository } from "../repository/PasswordResetRepository.js"
import { SolicitarPasswordUseCase } from "../password/SolicitarPasswordUseCase.js";
import { SendEmailUseCase } from "../password/SendEmailUseCase.js"

const router = new Router();
const repoUser = AppDataSource.getRepository("Usuario");
const repoPassword = AppDataSource.getRepository("PasswordReset");
const userRepository = new UsuarioRepository(repoUser);
const passwordResetRepository = new PasswordResetRepository(repoPassword);
const encriptarPassword= new EncriptarPasswordUseCase();
const sendEmail = new SendEmailUseCase();

const restablecerPassword = new RestablecerPasswordUseCase(passwordResetRepository, encriptarPassword, userRepository);
const solicitarPassword = new SolicitarPasswordUseCase(userRepository, passwordResetRepository, sendEmail);

router.post("/usuario", restablecerPassword.execute);
router.post("", solicitarPassword.execute);

router.get('/reset/:token', async (req, res) => {
    const { token } = req.params;
    res.redirect(`http://localhost:5173/restablecer-password.html?token=${token}`);
});

router.get("/validar-token/:token", async (req, res) => {
    try {
        const { token } = req.params;
        
        const resetRecord = await passwordResetRepository.findByToken(token);
        
        if (!resetRecord) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'El enlace de recuperación ha expirado o ya ha sido utilizado.' 
            });
        }

        return res.status(200).json({ 
            status: 'success', 
            message: 'Token válido.' 
        });
        
    } catch (error) {
        console.error("Error al validar token:", error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Error interno del servidor.' 
        });
    }
});

export default router;