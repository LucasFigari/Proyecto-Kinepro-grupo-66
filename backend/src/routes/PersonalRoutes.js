// src/routes/PersonalRoutes.js
import { Router } from "express"
import { registrarPersonal, validarDniUnico, validarCorreoUnico } from "../controllers/PersonalController.js"

const router = Router()

router.post("/registrar", registrarPersonal)

router.get("/verificar-dni:dni", validarDniUnico)

router.get("/verificar-email:email", validarCorreoUnico)

export default router