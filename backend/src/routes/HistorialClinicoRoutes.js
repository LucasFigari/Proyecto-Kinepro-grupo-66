import { Router } from "express"
import { crearHistorial, obtenerHistorialPorPaciente } from "../controllers/HistorialClinicoController.js"

const router = Router()

router.post("/crear", crearHistorial)
router.get("/paciente/:idPaciente", obtenerHistorialPorPaciente)

export default router