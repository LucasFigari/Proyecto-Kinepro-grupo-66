import { EntitySchema, JoinColumn } from "typeorm";

const ListaAnotadosSchema = new EntitySchema({
    name: "ListaAnotados",
    tableName: "lista_anotados",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        }
    },
    relations: {
        turno: {
            target: "Turno",
            type: "many-to-one",
            joinColumn: { name: "id_turno"},
            onDelete: "CASCADE"
        },
        usuario: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "id_usuario"},
            onDelete: "CASCADE"
        }
    }
})

export default ListaAnotadosSchema;