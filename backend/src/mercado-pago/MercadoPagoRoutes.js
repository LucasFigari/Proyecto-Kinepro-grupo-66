import { Router } from "express";
import { handleMercadoPagoWebhook } from "./WebHookController.js";
import { createPaymentPreference } from "./PaymentController.js";
import { seRealizoPago } from "./PaymentController.js";
import { Order } from "mercadopago";

const mercadoRouter = Router();

mercadoRouter.post("/webhook/mercadopago", handleMercadoPagoWebhook);

mercadoRouter.post("/checkout", async (req, res) => {
    try {
        const { amount, description , idTurno, idUsuario} = req.body;

        if (!amount || !description) {
        return res.status(400).json({ 
            message: "El monto (amount) y la descripción son obligatorios." 
        });
        }

        const paymentData = await createPaymentPreference(amount, description, idTurno, idUsuario);

        return res.status(201).json({
        message: "Preferencia de pago creada con éxito",
        data: paymentData
        });

    } catch (error) {
        console.error("Error al crear la preferencia de Mercado Pago:", error);
        
        return res.status(500).json({
        message: "Hubo un error interno al procesar el pago.",
        error: error.message
        });
    }
});

mercadoRouter.post("/realizo-pago", async (req, res) => {
    try {
        const {idTurno, idUsuario} = req.body;
        const order = await seRealizoPago(idTurno, idUsuario);
        
        return res.status(201).json(order);
    } catch (error) {
        
    }
});


export default mercadoRouter;