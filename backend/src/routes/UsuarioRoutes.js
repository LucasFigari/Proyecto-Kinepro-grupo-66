// src/routes/UsuarioRoutes.js
import { Router } from "express"
import { registrarUsuario, verificarDni, verificarEmail } from "../controllers/UsuarioController.js"

const router = Router()

router.post("/registrar", registrarUsuario)

router.get("/verificar-dni/:dni", verificarDni)

router.get("/verificar-email/:email", verificarEmail)

export default router