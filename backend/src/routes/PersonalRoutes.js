// src/routes/PersonalRoutes.js
import { Router } from "express"
import { registrarPersonal } from "../controllers/PersonalController.js"

const router = Router()

router.post("/registrar", registrarPersonal)

export default router