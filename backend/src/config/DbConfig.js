
import { DataSource } from "typeorm";
import UserSchema from "../schema/UsuarioSchema.js"
import AreaDeTratamientoSchema from "../schema/AreaDeTratamientoSchema.js";

const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "db_kinesiologia",
    synchronize: true,
    logging: false,
    entities: [UserSchema, AreaDeTratamientoSchema],
});

export default AppDataSource;