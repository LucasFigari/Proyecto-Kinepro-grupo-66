import { Router } from "express";
import { obtenerTurnosPorPaciente, obtenerTurnosDisponiblesPorArea } from "../controllers/TurnosController.js";
import { TurnosPorSecretariaController} from "../controllers/TurnosPorSecretariaController.js"
import { TurnoRepository} from "../repository/TurnoRepository.js"
import { UsuarioRepository } from "../repository/UsuarioRepository.js";
import AppDataSource from "../config/DbConfig.js";
import { SendEmailUseCase } from "../password/SendEmailUseCase.js";
import { TurnoAsignadoRepository } from "../repository/TurnoAsignadoRepository.js";
import { PagoRepository } from "../repository/PagoRepository.js";

const router = Router();

const repoTurno = AppDataSource.getRepository("Turno");
const repoUSuario = AppDataSource.getRepository("Usuario");
const repoTurnoAsignado = AppDataSource.getRepository("TurnoAsignado");
const repoPago = AppDataSource.getRepository("Pago");
const sendEmail = new SendEmailUseCase();

const turnoRepository = new TurnoRepository(repoTurno);
const usuarioRepository = new UsuarioRepository(repoUSuario);
const turnoAsignadoRepository = new TurnoAsignadoRepository(repoTurnoAsignado);
const pagoRepository = new PagoRepository(repoPago);

const turnoPorSecretariaController = new TurnosPorSecretariaController(turnoRepository, usuarioRepository, turnoAsignadoRepository, pagoRepository,sendEmail);


router.get("/paciente/:id", obtenerTurnosPorPaciente);
router.get("/area/:idArea", obtenerTurnosDisponiblesPorArea); 
router.get("", turnoPorSecretariaController.obtenerTurnosDisponibles);
router.get("/precio/:idTurno", turnoPorSecretariaController.obtnerPrecioDeTurno);
router.post("/reservar", turnoPorSecretariaController.agregarUsuarioATurno);
router.post("/pagos/efectivo", turnoPorSecretariaController.registrarPagoDeTurno);
  
export default router;