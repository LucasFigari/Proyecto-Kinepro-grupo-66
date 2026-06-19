import { EntitySchema } from "typeorm"

const PagoSchema = new EntitySchema({
    name: "Pago",
    tableName: "pagos",
    
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        monto: {
            type: "decimal", 
            precision: 10,
            scale: 2
        },
        metodo: {
            type: "varchar",
        },
        fecha_pago: {
            type: "date"
        }
    }, 

    relations: {
        Turno: {
            target: "Turno",
            type: "one-to-one",
            joinColumn: { name: "idTurno" }, 
            nullable: false,
            eager: true
        }
    }
})

export default PagoSchema;