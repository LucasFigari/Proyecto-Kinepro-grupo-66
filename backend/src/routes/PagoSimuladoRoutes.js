// src/routes/PagoSimuladoRoutes.js
import { Router } from "express"
import { procesarPagoSimulado } from "../controllers/PagoSimuladoController.js"

const router = Router()

router.post("/pagar", procesarPagoSimulado)

export default router