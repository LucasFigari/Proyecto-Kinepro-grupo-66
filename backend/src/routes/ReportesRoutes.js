import { Router } from "express"
import { ReporteController} from "../controllers/ReporteController.js"

const router = Router()

const reporteController = new ReporteController();

router.get("/pagos", reporteController.obtenerPagos);
router.get("/asistencias-inasistencias", reporteController.obtenerAsistenciaEInasistencias);


export default router;