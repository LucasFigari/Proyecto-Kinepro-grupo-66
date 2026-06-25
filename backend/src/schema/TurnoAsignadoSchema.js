import { EntitySchema } from "typeorm"

const TurnoAsignadoSchema = new EntitySchema({
    name: "TurnoAsignado",
    tableName: "turno_asignados",
    
    columns: {
        idUsuario: {
            primary: true,
            type: "int"
        },
        idTurno: {
            primary: true,
            type: "int"
        },
        estado: {
            type: "varchar"
        }
    }, 

    relations: {

        turno: {
            target: "Turno",
            type: "many-to-one",
            joinColumn: { name: "idTurno" }, 
            inverseSide: "turnoAsignado",
            eager: false
        },

        usuario: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "idUsuario" },
            inverseSide: "turnoAsignado",
            eager: false
        },

    
    }
})

export default TurnoAsignadoSchema;