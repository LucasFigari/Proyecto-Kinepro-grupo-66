import 'dotenv/config';
import express from "express";
import AppDataSource from "./config/DbConfig.js";
import cors from "cors";
import AreaDeTratamientoRoutes from "./routes/AreaDeTratamientoRoutes.js"
import UsuarioRoutes from "./routes/UsuarioRoutes.js"
import PersonalRoutes from "./routes/PersonalRoutes.js"
import LoginRoutes from "./routes/LoginRoutes.js"
import PasswordRoutes from "./routes/PasswordRoutes.js"
import turnoRutas from "./routes/TurnosRoutes.js"
import HistorialClinicoRoutes from "./routes/HistorialClinicoRoutes.js"

//import "./controllers/Cron.js"

import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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



// Forzamos la ruta absoluta a la carpeta de imágenes dentro de src
app.use('/imagenes', express.static(path.resolve(__dirname, 'imagenes')));


app.use("/area", AreaDeTratamientoRoutes)
app.use("/usuarios", UsuarioRoutes)
app.use("/personal", PersonalRoutes)
app.use("/login", LoginRoutes)
app.use("/forgot-password", PasswordRoutes);
app.use("/turnos", turnoRutas)
app.use("/historial", HistorialClinicoRoutes)
app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});