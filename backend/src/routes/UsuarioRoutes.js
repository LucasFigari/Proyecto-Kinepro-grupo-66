import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import AppDataSource from "../config/DbConfig.js";
import { UsuarioService } from "../service/UsuarioService.js";
import { UsuarioRepository} from "../repository/UsuarioRepository.js"
import { EncriptarPasswordUseCase } from "../password/EncriptarPasswordUseCase.js";

const router = new Router();

const repo = AppDataSource.getRepository("Usuario");
const encriptarPassword = new EncriptarPasswordUseCase();
const userRepository = new UsuarioRepository(repo);
const usuarioService = new UsuarioService(userRepository, encriptarPassword);
const usuarioController = new UsuarioController(usuarioService);

router.post("/registrar-usuario", usuarioController.saveUsuario);

export default router;
