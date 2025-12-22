'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PurchaseRequestItem extends Model {
    static associate(models) {
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
  PurchaseRequestItem.init(
    {
      purchase_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PurchaseRequestItem',
    },
  );
  return PurchaseRequestItem;
};
