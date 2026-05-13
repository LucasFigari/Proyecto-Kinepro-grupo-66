// src/schema/PersonalSchema.js
import { EntitySchema } from "typeorm"

const PersonalSchema = new EntitySchema({
    name: "Personal",
    tableName: "personal",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombre: {
            type: "varchar",
        },
        apellido: {
            type: "varchar",
        },
        fechaNac: {
            type: "date",
        },
        dni: {
            type: "varchar",
            unique: true
        },
        email: {
            type: "varchar",
            unique: true
        },
        password: {
            type: "varchar"
        },
        telefono: {
            type: "varchar"
        },
        rol: {
            type: "varchar"
        }
    }
})

export default PersonalSchema