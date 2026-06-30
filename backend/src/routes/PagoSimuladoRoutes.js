// src/routes/PagoSimuladoRoutes.js
import { Router } from "express"
import { procesarPagoSimulado , obtenerPagosPorUsuario } from "../controllers/PagoSimuladoController.js"

const router = Router()

router.post("/pagar", procesarPagoSimulado)
router.get("/usuario/:idUsuario", obtenerPagosPorUsuario)

export default router