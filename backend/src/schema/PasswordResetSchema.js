import { EntitySchema } from "typeorm";

const PasswordResetSchema = new EntitySchema({
    name: "PasswordReset",
    tableName: "password_resets",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        user_id: {
            type: "int",
        },
        token: {
            type: "varchar",
            unique: true
        },
        expires_at: {
            type: "timestamp",
        }
    },
});

export default PasswordResetSchema;