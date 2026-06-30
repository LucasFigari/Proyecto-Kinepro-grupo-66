// src/schema/TarjetaSchema.js
import { EntitySchema } from "typeorm"

const TarjetaSchema = new EntitySchema({
    name: "Tarjeta",
    tableName: "tarjetas",
    columns: {
        id: { primary: true, type: "int", generated: true },
        numero: { type: "varchar", unique: true },
        titular: { type: "varchar" },
        vencimiento: { type: "varchar" },
        cvv: { type: "varchar" },
        saldo: { type: "decimal", precision: 10, scale: 2 },
        simularErrorConexion: { type: "boolean", default: false }
    }
})

export default TarjetaSchema