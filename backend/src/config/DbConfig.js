
import { DataSource } from "typeorm";
import UserSchema from "../schema/UsuarioSchema.js"
import AreaDeTratamientoSchema from "../schema/AreaDeTratamientoSchema.js";
import PasswordResetSchema from "../schema/PasswordResetSchema.js"
import PersonalSchema from "../schema/PersonalSchema.js";
import TurnoSchema from "../schema/TurnosSchema.js";
import TurnoAsignadoSchema from "../schema/TurnoAsignadoSchema.js";
import PagoSchema from "../schema/PagoSchema.js";

const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "db_kinesiologia",
    synchronize: true,
    logging: false,
    entities: [UserSchema, AreaDeTratamientoSchema, TurnoSchema, PasswordResetSchema, PersonalSchema, TurnoAsignadoSchema, PagoSchema],
});

export default AppDataSource;