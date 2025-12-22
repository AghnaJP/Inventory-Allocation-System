'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PurchaseRequest extends Model {
    static associate(models) {
      PurchaseRequest.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_id',
        as: 'warehouse',
      });
      PurchaseRequest.hasMany(models.PurchaseRequestItem, {
        foreignKey: 'purchase_request_id',
        as: 'items',
      });
    }
  }
  PurchaseRequest.init(
    {
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      vendor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PurchaseRequest',
    },
  );
  return PurchaseRequest;
};
