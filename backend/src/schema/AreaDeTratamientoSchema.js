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
        deletedAt: {
        type: "timestamp",
        deleteDate: true, 
        nullable: true
    }
    }
});

export default AreaDeTratamientoSchema;