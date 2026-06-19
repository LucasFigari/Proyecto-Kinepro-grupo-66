
import { DataSource } from "typeorm";
import UserSchema from "../schema/UsuarioSchema.js"
import AreaDeTratamientoSchema from "../schema/AreaDeTratamientoSchema.js";
import PasswordResetSchema from "../schema/PasswordResetSchema.js"
import PersonalSchema from "../schema/PersonalSchema.js";
import TurnoSchema from "../schema/TurnosSchema.js";
import ListaAnotadosSchema from "../schema/ListaAnotadosSchema.js";
import ListaEsperaSchema from "../schema/ListaEsperaSchema.js";
import HistorialClinicoSchema from "../schema/HistorialClinicoSchema.js";

const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "db_kinesiologia",
    synchronize: true,
    logging: false,
    entities: [UserSchema, AreaDeTratamientoSchema, TurnoSchema, PasswordResetSchema, PersonalSchema, ListaAnotadosSchema, ListaEsperaSchema, HistorialClinicoSchema],
});

export default AppDataSource;