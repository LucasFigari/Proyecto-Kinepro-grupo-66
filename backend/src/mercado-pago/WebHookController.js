// webhook.controller.js
import { Payment } from "mercadopago";
import AppDataSource from "../config/DbConfig.js";
import { mpClient } from "../config/MpClient.js";


export async function handleMercadoPagoWebhook(req, res) {
  const { query } = req;

  if (query.type === "payment") {
    const paymentId = query["data.id"];

    try {
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: paymentId });

      const orderId = parseInt(paymentData.external_reference);
      const orderRepository = AppDataSource.getRepository("Order");

      const order = await orderRepository.findOneBy({ id: orderId });

      if (order) {
        order.status = paymentData.status;
        await orderRepository.save(order);

        console.log(`Orden ${orderId} actualizada a: ${paymentData.status}`);
      }
    } catch (error) {
      console.error("Error en el webhook de Mercado Pago:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(200).send("OK");
}