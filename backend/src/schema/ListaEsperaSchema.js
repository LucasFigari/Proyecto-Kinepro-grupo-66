import { EntitySchema } from "typeorm";

const ListaEsperaSchema = new EntitySchema({
    name: "ListaEspera",
    tableName: "lista_espera",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        fecha_inscripcion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        }
    },
    relations: {
        turno: {
            target: "Turno",
            type: "many-to-one",
            joinColumn: { name: "id_turno" },
            onDelete: "CASCADE"
        },
        usuario: {
            target: "Usuario",
            type: "many-to-one",
            joinColumn: { name: "id_usuario" },
            onDelete: "CASCADE"
        }
    }

});

export default ListaEsperaSchema;