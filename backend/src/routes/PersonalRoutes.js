// src/routes/PersonalRoutes.js
import { Router } from "express"
import { registrarPersonal, validarDniUnico, validarCorreoUnico, bajaPersonal, obtenerPersonal, editarPersonal } from "../controllers/PersonalController.js"


const router = Router()

router.post("/registrar", registrarPersonal)

router.get("/verificar-dni/:dni", validarDniUnico)

router.get("/verificar-email/:email", validarCorreoUnico)

router.get("/lista-completa", obtenerPersonal)

router.delete("/dar-baja-personal/:id", bajaPersonal)

router.put("/editar-personal/:id", editarPersonal)

export default router