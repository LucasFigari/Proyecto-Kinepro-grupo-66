import { Preference } from "mercadopago";
import { mpClient } from "../config/MpClient.js";
import AppDataSource from "../config/DbConfig.js";
import { calcularPrecioConMonto } from "../controllers/TurnosPorSecretariaController.js";

export async function createPaymentPreference(amount, description, idTurno, idUsuario) {
    const orderRepository = AppDataSource.getRepository("Order");

    const newOrder = orderRepository.create({ amount, status: "pending", idTurno, idUsuario});
    const savedOrder = await orderRepository.save(newOrder);

    try {
        const preference = new Preference(mpClient);

        const nuevo_amount = await calcularPrecioConMonto(amount);

        const preferenceData = {
            body: {
                items: [
                    {
                        id: String(savedOrder.id),
                        title: String(description),
                        quantity: 1,
                        unit_price: Number(nuevo_amount),
                        currency_id: "ARS"
                    }
                ],
                back_urls: {
                    success: "http://localhost:5173/success.html",
                    failure: "http://localhost:5173/failure.html",
                    pending: "http://localhost:5173/pending.html"
                },
                // auto_return: "approved", // permitir localhost
                notification_url: "https://---../pago/webhook/mercadopago",
                external_reference: String(savedOrder.id)
            }
        };

        const result = await preference.create(preferenceData);

        savedOrder.preferenceId = result.id;
        await orderRepository.save(savedOrder);

        return {
            preferenceId: result.id, 
            orderId: savedOrder.id,
            initPoint: result.init_point,
            sandboxInitPoint: result.sandbox_init_point,
        };

    } catch (error) {
        console.error("Error detallado al crear la preferencia:", error);
        
        savedOrder.status = "failed";
        await orderRepository.save(savedOrder);
        
        throw new Error("No se pudo procesar el pago con Mercado Pago en este momento.");
    }
}


export async function pagoEfectivo(idTurno, idUsuario) {
    const orderRepository = AppDataSource.getRepository("Order");
    const order = await orderRepository.findOne({
        where: { idTurno: idTurno, idUsuario: idUsuario }
    });

    if (!order) {
        throw new Error("No se encontró la orden para el turno y usuario especificados.");
    }
    order.status = "approved";
    await orderRepository.save(order);
}

export async function seRealizoPago(idTurno, idUsuario) {
    const orderRepository = AppDataSource.getRepository("Order");
    const order = await orderRepository.findOne({
        where: { idTurno: idTurno, idUsuario: idUsuario }
    });

    if (!order) {
        throw new Error("No se encontró la orden para el turno y usuario especificados.");
    }
    
    return order;
}
