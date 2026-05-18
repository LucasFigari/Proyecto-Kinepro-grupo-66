import { EntitySchema } from "typeorm"

const AreaDeTratamientoSchema = new EntitySchema({
    name: "AreaDeTratamiento",
    tableName: "areas_de_tratamiento",
    columns:{
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        nombre:{
            type: "varchar",
            unique: true
        },
        descripcion:{
            type: "varchar",
        },
        cupoMaximo:{
            type: "int",
            default: 10 //valor de prueba
        },
        cupoOcupados:{
            type: "int",
            default: 0 //cant de cupos ocupados
        },
        deletedAt: {
        type: "timestamp",
        deleteDate: true, 
        nullable: true
    }
    },
    relations: {
        turnos: {
            target: "Turno",
            type: "one-to-many",
            inverseSide: "area"
        }
    }
});

export default AreaDeTratamientoSchema;