import { DataTypes, Model, Optional, Sequelize, ModelStatic } from 'sequelize';

export interface PurchaseRequestItemAttributes {
  id: number;
  purchase_request_id: number;
  product_id: number;
  quantity: number;
}

export interface PurchaseRequestItemCreationAttributes extends Optional<
  PurchaseRequestItemAttributes,
  'id'
> {}

type Models = {
  PurchaseRequest: ModelStatic<Model>;
  Product: ModelStatic<Model>;
};

export class PurchaseRequestItem
  extends Model<PurchaseRequestItemAttributes, PurchaseRequestItemCreationAttributes>
  implements PurchaseRequestItemAttributes
{
  declare id: number;
  declare purchase_request_id: number;
  declare product_id: number;
  declare quantity: number;

  static associate(models: Models) {
    PurchaseRequestItem.belongsTo(models.PurchaseRequest, {
      foreignKey: 'purchase_request_id',
      as: 'purchaseRequest',
    });

    PurchaseRequestItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  PurchaseRequestItem.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      purchase_request_id: {
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
      },
    },
    {
      sequelize,
      modelName: 'PurchaseRequestItem',
      tableName: 'PurchaseRequestItems',
      timestamps: true,
    },
  );

  return PurchaseRequestItem;
};
