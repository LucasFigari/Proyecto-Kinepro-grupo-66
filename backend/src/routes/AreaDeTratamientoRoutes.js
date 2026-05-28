import { Router } from "express";
import { AreaDeTratamientoController } from "../controllers/AreaDeTratamientoController.js";
import AppDataSource from "../config/DbConfig.js";
import { AreaDeTratamientoService } from "../service/AreaDeTratamientoService.js";
import { AreaDeTratamientoRepository } from "../repository/AreaDeTratamientoRepository.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = new Router();

// Configuración de Multer para guardar en src/imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usamos ruta absoluta: desde src/routes subimos un nivel a src/ y entramos a imagenes/
        const uploadPath = path.join(__dirname, "..", "imagenes");
        
        // Creamos la carpeta si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Normalizamos: quitamos espacios y acentos básicos para evitar problemas de URL
        const nombreArea = req.body.nombre ? req.body.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '') : 'area';
        cb(null, `${nombreArea.toLowerCase()}.png`);
    }
});
const upload = multer({ storage });

const repo = AppDataSource.getRepository("AreaDeTratamiento");

const areaDeTratamientoRepository = new AreaDeTratamientoRepository(repo); 

const areaDeTratamientoService = new AreaDeTratamientoService(areaDeTratamientoRepository);

const areaDeTratameintoController = new AreaDeTratamientoController(areaDeTratamientoService);

router.post("/registrar-area", upload.single('imagen'), areaDeTratameintoController.saveArea);
router.get("/nombre:nombre", areaDeTratameintoController.getAreaByNombre);
router.get("/", areaDeTratameintoController.getAll);
router.delete("/:idParaEliminar", areaDeTratameintoController.deleteArea);



router.get("/:id/turnos", (req, res) => areaDeTratameintoController.getTurnosByArea(req, res));

router.post("/reservar", areaDeTratameintoController.reservarCupoDeArea);

export default router;