// src/controllers/PagoSimuladoController.js
import AppDataSource from "../config/DbConfig.js"

export const procesarPagoSimulado = async (req, res) => {
    const { numeroTarjeta, titular, vencimiento, cvv, idTurno, idUsuario , montoFinal} = req.body

    const repo = AppDataSource.getRepository("Tarjeta")

    const errorConexion = Math.random() < 0.1  // 10% de chance de error
    if(errorConexion){
        return res.status(503).json({ ok: false, mensaje: "Error de conexión con el servidor externo." })
    }

    const turnoAsignadoRepo = AppDataSource.getRepository("TurnoAsignado")
    const asignacion = await turnoAsignadoRepo.findOne({
        where: { idTurno: parseInt(idTurno), idUsuario: parseInt(idUsuario) }
    })
    if(asignacion.estado === "pagado"){
        return res.status(400).json({
            mensaje: `Ya se realizo el pago del turno nro "${asignacion.idTurno}"` 
        });
    }

    const tarjeta = await repo.findOne({ where: { numero: numeroTarjeta } })
    if(!tarjeta){
        return res.status(404).json({ ok: false, mensaje: "El número de tarjeta no existe." })
    }

    if(tarjeta.simularErrorConexion){
        return res.status(503).json({ ok: false, mensaje: "Error de conexión con el servidor externo." })
    }

    if(tarjeta.titular !== titular || tarjeta.vencimiento !== vencimiento || tarjeta.cvv !== cvv){
        return res.status(400).json({ ok: false, mensaje: "Los datos de la tarjeta son incorrectos." })
    }

    const turnoRepo = AppDataSource.getRepository("Turno")
    const turno = await turnoRepo.findOne({ where: { id: parseInt(idTurno) } })
    if(!turno){
        return res.status(404).json({ ok: false, mensaje: "El turno no existe." })
    }

    const hoy = new Date()
    const dia = hoy.getDate()
    let monto = parseFloat(turno.precio)

    if(dia >= 14 && dia <= 16){
        monto = monto * 0.8  // descuento del 20%
    }

    if(parseFloat(tarjeta.saldo) < monto){
        return res.status(400).json({ ok: false, mensaje: "Saldo insuficiente." })
    }

    tarjeta.saldo = parseFloat(tarjeta.saldo) - monto
    await repo.save(tarjeta)


    if(asignacion){
        asignacion.estado = "pagado"
        await turnoAsignadoRepo.save(asignacion)
    }

    try {
        const pagoRepo = AppDataSource.getRepository("Pago");
        await pagoRepo.save({
            idUsuario: parseInt(idUsuario),
            idTurno: parseInt(idTurno),
            metodo: "tarjeta",
            fecha_pago: hoy, 
            monto_pagado: monto, 
            codigo_pago: "TRJ-" + Date.now().toString().substring(3) // Código corto de 14 caracteres máximo
        });
        console.log("✅ Pago con tarjeta registrado legítimamente en la tabla general.");
    } catch (errorPago) {
        console.error("❌ Error al registrar el pago en la tabla pagos:", errorPago);
    }


    return res.json({
        ok: true,
        mensaje: "Pago realizado con éxito.",
        montoAbonado: monto,
        descuentoAplicado: dia >= 14 && dia <= 16
    })
}

export const obtenerPagosPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const repo = AppDataSource.getRepository("Pago"); // Asegurate de que se llame así tu entidad/schema

        const pagos = await repo.find({
            where: { idUsuario: parseInt(idUsuario) },
            order: { id: "ASC" }
        });

        return res.json(pagos);
    } catch (error) {
        console.error("Error al obtener historial de pagos:", error);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
};