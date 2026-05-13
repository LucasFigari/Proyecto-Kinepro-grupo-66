import 'dotenv/config';
import express from "express";
import AppDataSource from "./config/DbConfig.js";
import cors from "cors";
import AreaDeTratamientoRoutes from "./routes/AreaDeTratamientoRoutes.js"
import UsuarioRoutes from "./routes/UsuarioRoutes.js"


const app = express();
app.use(cors())
app.use(express.json());

try {
    await AppDataSource.initialize();
    console.log("✅ Conexión exitosa a la base de datos");
} catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1); 
}





app.use("/", AreaDeTratamientoRoutes)
app.use("/usuarios", UsuarioRoutes)


app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});