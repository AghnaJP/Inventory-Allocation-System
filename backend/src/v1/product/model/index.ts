import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import ProductModelDefiner from './Product';

export interface ProductDBModels {
  Product: ModelStatic<Model>;
}

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
});

const Product = ProductModelDefiner(sequelize, DataTypes);

const db: ProductDBModels & { sequelize: Sequelize } = {
  Product,
  sequelize,
};

export default db;
