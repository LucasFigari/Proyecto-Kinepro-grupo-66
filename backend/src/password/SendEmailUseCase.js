import Transporter from "../config/Transporter.js";

export class SendEmailUseCase{

    constructor(){
        this.Transporter = Transporter;
    }

    async execute(toUser, subject, message){
        const email = {
            from: process.env.MAIL_USER,
            to: toUser,
            subject: subject,
            text: message
        }

        try{
            const info = await this.Transporter.sendMail(email);
        } catch (error) {
            console.error('Error en SendMailUseCase:', error);
            throw new Error('No se pudo enviar el correo');
        }
    };

    async executeConHtml(toUser, subject, message, htmlContent = null) {
        const email = {
            from: process.env.MAIL_USER,
            to: toUser,
            subject: subject,
            text: message, // Respaldo en texto plano
            html: htmlContent // Aquí irá nuestra plantilla bonita
        };

        try {
            const info = await this.Transporter.sendMail(email);
            return info; // Es buena práctica retornar la info por si la necesitas
        } catch (error) {
            console.error('Error en SendMailUseCase:', error);
            throw new Error('No se pudo enviar el correo');
        }
    }
}