import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "js",
    synchronize: false,
    logging: false,
    entities: [],
});

export default AppDataSource;