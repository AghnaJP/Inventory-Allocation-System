import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ModelStatic,
} from 'sequelize';

export interface WarehouseAttributes {
  id: number;
  name: string;
}

type Models = {
  Stock: ModelStatic<Model>;
  PurchaseRequest: ModelStatic<Model>;
};

export class Warehouse
  extends Model<InferAttributes<Warehouse>, InferCreationAttributes<Warehouse>>
  implements WarehouseAttributes
{
  declare id: CreationOptional<number>;
  declare name: string;

  static associate(models: Models) {
    Warehouse.hasMany(models.Stock, {
      foreignKey: 'warehouse_id',
      as: 'stocks',
    });

    Warehouse.hasMany(models.PurchaseRequest, {
      foreignKey: 'warehouse_id',
      as: 'purchaseRequests',
    });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Warehouse.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Warehouse',
      tableName: 'Warehouses',
      timestamps: true,
    },
  );

  return Warehouse;
};
