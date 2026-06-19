import { Router } from "express"
import { agregarListaEspera, quitarListaDeEspera } from "../controllers/ListaDeEsperaController.js"

const router = Router()

router.post("/", agregarListaEspera);
router.delete("/", quitarListaDeEspera);

export default router;