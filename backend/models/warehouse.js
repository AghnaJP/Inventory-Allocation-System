'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Warehouse extends Model {
    static associate(models) {
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
  Warehouse.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Warehouse',
    },
  );
  return Warehouse;
};
