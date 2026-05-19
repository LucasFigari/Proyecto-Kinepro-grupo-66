import { EntitySchema } from "typeorm";

const TurnoSchema = new EntitySchema({
    name: "Turno",
    tableName: "turnos",

    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },

        fecha: {
            type: "date"
        },

        horario: {
            type: "time"
        },

        isDisponible: {
            type: "boolean",
            default: true
        }
    },

    relations: {

        area: {
            target: "AreaDeTratamiento",
            type: "many-to-one",
            joinColumn: { name: "areaId" },
            inverseSide: "turnos",
            onDelete: "CASCADE"
        },

        usuario: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "usuarioId" },
            nullable: true,
            onDelete: "SET NULL"
        }
    }
});

export default TurnoSchema;