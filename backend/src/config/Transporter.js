import Nodemailer from 'nodemailer';

const Transporter = Nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD
    },
    tls:{
        rejectUnauthorized: false
    }
});

export default Transporter;