import { EntitySchema } from "typeorm"

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
        },
 
    },
    relations: {
        area: {
            target: "AreaDeTratamiento",
            type: "many-to-one",
            joinColumn: { name: "areaId" }, // Esto genera la columna de FK en Postgres
            inverseSide: "turnos",
            onDelete: "CASCADE" // Si eliminan un área, se limpian sus turnos automáticamente
        }
    }
});

export default TurnoSchema;