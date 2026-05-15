// src/routes/UsuarioRoutes.js
import { Router } from "express"
import { registrarUsuario, verificarDni, verificarEmail , obtenerPerfilCliente } from "../controllers/UsuarioController.js"
import { verificarToken } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/registrar", registrarUsuario)

router.get("/verificar-dni/:dni", verificarDni)

router.get("/verificar-email/:email", verificarEmail)

router.get("/Perfil/:id", obtenerPerfilCliente)

export default router