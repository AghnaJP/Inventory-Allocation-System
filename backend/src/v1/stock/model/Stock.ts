import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ModelStatic,
} from 'sequelize';

type Models = {
  Warehouse: ModelStatic<Model>;
  Product: ModelStatic<Model>;
};

export interface StockAttributes {
  id: number;
  warehouse_id: number;
  product_id: number;
  quantity: number;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
    declare id: CreationOptional<number>;
    declare warehouse_id: number;
    declare product_id: number;
    declare quantity: number;

    static associate(models: Models) {
      Stock.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_id',
        as: 'warehouse',
      });
      Stock.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  Stock.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      warehouse_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Stock',
      tableName: 'Stocks',
      timestamps: true,
    },
  );

  return Stock;
};
