import { Router } from "express"
import { agregarListaEspera, quitarListaDeEspera, obtenerListaEsperaPorTurno } from "../controllers/ListaDeEsperaController.js"

const router = Router()
router.get("/:idTurno", obtenerListaEsperaPorTurno);
router.post("/", agregarListaEspera);
router.delete("/", quitarListaDeEspera);

export default router;