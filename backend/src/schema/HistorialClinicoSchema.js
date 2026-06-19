import { EntitySchema } from "typeorm"

const HistorialClinicoSchema = new EntitySchema({
    name: "HistorialClinico",
    tableName: "historial_clinico",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        titulo: {
            type: "varchar"
        },
        fecha: {
            type: "date"
        },
        diagnostico: {
            type: "text"
        }
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "Usuario",       // nombre del schema de usuarios
            joinColumn: { name: "id_usuario" },
            nullable: false
        },
        kinesiologo: {
            type: "many-to-one",
            target: "Personal",      // nombre del schema de personal
            joinColumn: { name: "id_kinesiologo" },
            nullable: false
        },
        area: {
            type: "many-to-one",
            target: "AreaDeTratamiento",  // nombre del schema de areas
            joinColumn: { name: "id_area_tratamiento" },
            nullable: false
        }
    }
})

export default HistorialClinicoSchema