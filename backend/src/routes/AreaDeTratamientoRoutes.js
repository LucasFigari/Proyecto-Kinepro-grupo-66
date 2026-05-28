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

// 1. Configuración de Almacenamiento de Multer (Queda igual a como lo tenías)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "..", "imagenes");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const nombreArea = req.body.nombre ? req.body.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '') : 'area';
        cb(null, `${nombreArea.toLowerCase()}.png`);
    }
});

// 2. 🌟 FILTRO PARA CONTROLAR QUE SÓLO ENTREN IMÁGENES
const fileFilter = (req, file, cb) => {
    // Tipos de archivos permitidos (mimetypes estándares para fotos)
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true); // Es una imagen, la dejamos pasar
    } else {
        // No es una imagen (es un .zip, una carpeta, un pdf). Tiramos error
        cb(new Error('El archivo seleccionado no es una imagen'), false);
    }
};

// 3. Unimos el storage con el filtro nuevo en Multer
const upload = multer({ 
    storage,
    fileFilter
});

const repo = AppDataSource.getRepository("AreaDeTratamiento");
const areaDeTratamientoRepository = new AreaDeTratamientoRepository(repo); 
const areaDeTratamientoService = new AreaDeTratamientoService(areaDeTratamientoRepository);
const areaDeTratameintoController = new AreaDeTratamientoController(areaDeTratamientoService);

// 4. 🌟 RUTA DE REGISTRO MODIFICADA PARA ATRAPAR EL ERROR
router.post("/registrar-area", (req, res, next) => {
    // Ejecutamos Multer de forma manual para poder atrapar si saltó el fileFilter
    upload.single('imagen')(req, res, function (err) {
        if (err) {
            // ❌ Si Multer tiró error, respondemos con status 400 y mandamos el mensaje
            return res.status(400).json({ 
                ok: false, 
                detalles: err.message 
            });
        }

        // 🛑 VALIDACIÓN: Si no hay archivo, devolvemos error
        if (!req.file) {
            return res.status(400).json({ 
                ok: false, 
                detalles: 'Debe subir una imagen para crear el área' 
            });
        }

        // Si no hubo errores, continuamos camino directo al controlador
        next();
    });
}, (req, res) => areaDeTratameintoController.saveArea(req, res)); // Aseguramos el scope del req y res por las dudas

router.get("/nombre:nombre", areaDeTratameintoController.getAreaByNombre);
router.get("/", areaDeTratameintoController.getAll);
router.delete("/:idParaEliminar", areaDeTratameintoController.deleteArea);

router.get("/:id/turnos", (req, res) => areaDeTratameintoController.getTurnosByArea(req, res));
router.post("/reservar", areaDeTratameintoController.reservarCupoDeArea);

export default router;