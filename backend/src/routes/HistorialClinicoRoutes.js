import { Router } from "express"
import { crearHistorial, obtenerHistorialPorPaciente, eliminarHistorial, modificarHistorial } from "../controllers/HistorialClinicoController.js"

const router = Router()

router.post("/crear", crearHistorial)
router.get("/paciente/:idPaciente", obtenerHistorialPorPaciente)
router.delete("/:id", eliminarHistorial)
router.put("/:id", modificarHistorial)

export default router