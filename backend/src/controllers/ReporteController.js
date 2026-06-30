import AppDataSource from "../config/DbConfig.js";
import { Raw } from "typeorm";

export class ReporteController{

    constructor(){
        this.repoPago = AppDataSource.getRepository("Pago");
        this.repoTurnoAsignado = AppDataSource.getRepository("TurnoAsignado");

    }

    obtenerPagos = async (req, res) => {
        try {
            const { mes, anio } = req.query;
            
            const pagos = await this.repoPago.find({ relations: ['turnoAsignado'] });

            const meses = { Enero:'01', Febrero:'02', Marzo:'03', Abril:'04', Mayo:'05', Junio:'06', Julio:'07', Agosto:'08', Septiembre:'09', Octubre:'10', Noviembre:'11', Diciembre:'12' };

            if (mes && anio && meses[mes]) {
                const buscar = `${anio}-${meses[mes]}`; 
                const pagosFiltrados = pagos.filter(p => p.fecha_pago.startsWith(buscar));
                return res.status(200).json(pagosFiltrados);
            }

            return res.status(200).json(pagos);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    //

    obtenerAsistenciaEInasistencias = async (req, res) => {
        try {
            const { mes, anio } = req.query; 
            const meses = { 
                Enero:'01', Febrero:'02', Marzo:'03', Abril:'04', 
                Mayo:'05', Junio:'06', Julio:'07', Agosto:'08', 
                Septiembre:'09', Octubre:'10', Noviembre:'11', Diciembre:'12' 
            };

            const donde = {};

            if (mes && anio && meses[mes]) {
                const buscar = `${anio}-${meses[mes]}`;
                
                donde.fecha_asistencia = Raw(alias => `to_char(${alias}, 'YYYY-MM') = :periodo`, { periodo: buscar });
            }

            const registros = await this.repoTurnoAsignado.find({ where: donde });

            const asistencias = registros.filter(r => 
                r.asistencia && r.asistencia.toLowerCase().includes('asistio')
            ); 
            const inasistencias = registros.filter(r => 
                r.asistencia && r.asistencia.toLowerCase().includes('falto')
            );

            return res.status(200).json({
                asistencias,
                inasistencias,
                total: registros.length
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });           
        }
    }
}