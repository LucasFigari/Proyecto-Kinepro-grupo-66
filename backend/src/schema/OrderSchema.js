import { EntitySchema } from "typeorm";

const OrderSchema = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    amount: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    status: {
      type: "varchar",
      default: "pending",
    },
    preferenceId: {
      type: "varchar",
      nullable: true,
    },
    idTurno:{
      type: "int",
    },
    idUsuario:{
      type: "int"
    }
  },
});

export default OrderSchema;