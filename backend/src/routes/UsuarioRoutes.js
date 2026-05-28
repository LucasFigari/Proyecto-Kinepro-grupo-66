import { Router } from "express";
import AppDataSource from "../config/DbConfig.js";
import { UsuarioService } from "../service/UsuarioService.js";
import { UsuarioRepository } from "../repository/UsuarioRepository.js";
import { EncriptarPasswordUseCase } from "../password/EncriptarPasswordUseCase.js";

import { registrarUsuario, verificarDni, verificarEmail,buscarPaciente, obtenerPerfil, eliminarPerfil, obtenerTodosUsuarios, editarUsuario } from "../controllers/UsuarioController.js";

const router = Router();

const repo = AppDataSource.getRepository("Usuario");
const encriptarPassword = new EncriptarPasswordUseCase();
const userRepository = new UsuarioRepository(repo);
const usuarioService = new UsuarioService(userRepository, encriptarPassword);


router.post("/registrar", registrarUsuario);
router.get("/verificar-dni/:dni", verificarDni);
router.get("/verificar-email/:email", verificarEmail);
router.get("/buscar/:busqueda", buscarPaciente);

router.get("/:id", obtenerPerfil);

router.put("/editar/:id", editarUsuario)

router.delete("/:id" , eliminarPerfil)
router.get("/", obtenerTodosUsuarios);
export default router;