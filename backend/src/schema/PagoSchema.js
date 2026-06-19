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
        idUsuario: {
            type: "int"
        },
        idTurno: {
            type: "int"
        },
        monto_recibido: {
            type: "decimal", 
            precision: 10,
            scale: 2
        },
        monto_devuelto: {
            type: "decimal", 
            precision: 10,
            scale: 2
        },
        precio_turno: {
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
        turnoAsignado: {
            target: "TurnoAsignado",
            type: "one-to-one",
            joinColumn: [
                { name: "idUsuario", referencedColumnName: "idUsuario" },
                { name: "idTurno", referencedColumnName: "idTurno" }
            ],
            nullable: false,
            eager: true,
            inverseSide: "pago"
        }
    }
})

export default PagoSchema;