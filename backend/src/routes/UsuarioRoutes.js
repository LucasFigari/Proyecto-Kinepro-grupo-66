// src/routes/UsuarioRoutes.js
import { Router } from "express"
import { registrarUsuario } from "../controllers/UsuarioController.js"

const router = Router()

router.post("/registrar", registrarUsuario)

export default router