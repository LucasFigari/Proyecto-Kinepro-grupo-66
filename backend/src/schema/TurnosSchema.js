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

        hora_fin: {
            type: "time"
        },
        
        precio: {
            type: 'decimal',
            precision: 10,
            scale: 2,      
        },

        cupo_maximo:{
            type: "int",
        },

        cupos_ocupados:{
            type: "int",
            default: 0
        }
    },

    relations: {
        area: {
            target: "AreaDeTratamiento",
            type: "many-to-one",
            joinColumn: { name: "areaId" },
            inverseSide: "turnos",
            onDelete: "CASCADE",
            eager: true
        },

        turnoAsignado: {
            type: "one-to-many",
            target: "TurnoAsignado",
            inverseSide: "turno",
            eager: false
        }

    }
});

export default TurnoSchema;