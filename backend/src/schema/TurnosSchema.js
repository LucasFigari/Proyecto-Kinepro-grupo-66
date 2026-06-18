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
        fecha_turno: {
            type: "date"
        },
        hora_comienzo: {
            type: "time"
        },
        hora_fin:{
            type: "time"
        },
        cupos: {
            type: "int"
        }
    },

    relations: {
        area: {
            target: "AreaDeTratamiento",
            type: "many-to-one",
            joinColumn: { name: "id_area_tratamiento" },
            onDelete: "CASCADE"
        }
    }
});

export default TurnoSchema;