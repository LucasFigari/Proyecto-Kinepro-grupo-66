
import { DataSource } from "typeorm";
import UserSchema from "../schema/UsuarioSchema.js"
import AreaDeTratamientoSchema from "../schema/AreaDeTratamientoSchema.js";
import PersonalSchema from "../schema/PersonalSchema.js";

const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "db_kinesiologia",
    synchronize: true,
    logging: false,
    entities: [UserSchema, AreaDeTratamientoSchema, PersonalSchema], //se agregó el schema del Personal
});

export default AppDataSource;