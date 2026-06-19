import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
    name: "Usuario",
    tableName: "usuarios",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        dni: {
            type: "varchar",
            unique: true
        },
        nombre: {
            type: "varchar",
        },
        apellido: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type : "varchar"
        },
        telefono: {
            type: "varchar"
        }
    },
    relations: {

        turnoAsignado: {
            type: "one-to-many",
            target: "TurnoAsignado",
            inverseSide: "usuario",
            eager: true
        }
    }
});

export default UserSchema;