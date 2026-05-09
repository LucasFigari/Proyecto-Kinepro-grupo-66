import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
    name: "Usuario",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
    },
});

export default UserSchema;