import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ModelStatic,
} from 'sequelize';

type Models = {
  Stock: ModelStatic<Model>;
  PurchaseRequestItem: ModelStatic<Model>;
};

export interface ProductAttributes {
  id: number;
  name: string;
  sku: string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare sku: string;

    static associate(models: Models) {
      Product.hasMany(models.Stock, {
        foreignKey: 'product_id',
        as: 'stocks',
      });
      Product.hasMany(models.PurchaseRequestItem, {
        foreignKey: 'product_id',
        as: 'purchaseRequestItems',
      });
    }
  }

  Product.init(
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
      sku: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true,
    },
  );

  return Product;
};
