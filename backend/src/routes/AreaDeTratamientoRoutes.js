import { Router } from "express";
import { AreaDeTratamientoController } from "../controllers/AreaDeTratamientoController.js";
import AppDataSource from "../config/DbConfig.js";
import { AreaDeTratamientoService } from "../service/AreaDeTratamientoService.js";
import { AreaDeTratamientoRepository } from "../repository/AreaDeTratamientoRepository.js";

const router = new Router();

const repo = AppDataSource.getRepository("AreaDeTratamiento");

const areaDeTratamientoRepository = new AreaDeTratamientoRepository(repo); 

const areaDeTratamientoService = new AreaDeTratamientoService(areaDeTratamientoRepository);

const areaDeTratameintoController = new AreaDeTratamientoController(areaDeTratamientoService);

router.post("/registrar-area", areaDeTratameintoController.saveArea);
router.get("/nombre:nombre", areaDeTratameintoController.getAreaByNombre);
router.get("/", areaDeTratameintoController.getAll);

export default router;