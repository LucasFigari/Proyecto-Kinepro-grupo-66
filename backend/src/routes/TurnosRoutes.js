import { Router } from "express";
import { obtenerTurnosPorPaciente } from "../controllers/turnosController.js";

const router = Router();

// Definís el endpoint exacto que tiraba 404
router.get("/paciente/:id", obtenerTurnosPorPaciente);

export default router;