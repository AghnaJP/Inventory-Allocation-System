import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PurchaseRequestAttributes {
  id: number;
  reference: string;
  warehouse_id: number;
  status: string;
  vendor?: string | null;
}

export interface PurchaseRequestCreationAttributes extends Optional<
  PurchaseRequestAttributes,
  'id'
> {}

export class PurchaseRequest extends Model<
  PurchaseRequestAttributes,
  PurchaseRequestCreationAttributes
> {
  declare id: number;
  declare reference: string;
  declare warehouse_id: number;
  declare status: string;
  declare vendor?: string | null;

  static associate(models: { Warehouse: any; PurchaseRequestItem: any }) {
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

export default function PurchaseRequestModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  PurchaseRequest.init(
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reference: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      warehouse_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: dataTypes.STRING,
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      vendor: {
        type: dataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PurchaseRequest',
    },
  );

  return PurchaseRequest;
}
