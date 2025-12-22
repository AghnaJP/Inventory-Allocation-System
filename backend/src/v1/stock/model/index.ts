import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import ProductModelDefiner, { ProductAttributes } from '../../product/model/Product';
import StockModelDefiner, { StockAttributes } from '../../stock/model/Stock';
import WarehouseModelDefiner, { WarehouseAttributes } from '../../warehouse/model/Warehouse';
import PurchaseRequestModelDefiner, {
  PurchaseRequestAttributes,
} from '../../purchase-request/model/PurchaseRequest';
import PurchaseRequestItemModelDefiner, {
  PurchaseRequestItemAttributes,
} from '../../purchase-request/model/PurchaseRequestItem';
export type DBModels = {
  Product: ModelStatic<Model<ProductAttributes | any>>;
  Stock: ModelStatic<Model<StockAttributes | any>>;
  Warehouse: ModelStatic<Model<WarehouseAttributes | any>>;
  PurchaseRequest: ModelStatic<Model<PurchaseRequestAttributes | any>>;
  PurchaseRequestItem: ModelStatic<Model<PurchaseRequestItemAttributes | any>>;
};

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
});

const Product = ProductModelDefiner(sequelize, DataTypes);
const Stock = StockModelDefiner(sequelize, DataTypes);
const Warehouse = WarehouseModelDefiner(sequelize, DataTypes);
const PurchaseRequest = PurchaseRequestModelDefiner(sequelize, DataTypes);
const PurchaseRequestItem = PurchaseRequestItemModelDefiner(sequelize, DataTypes);

Product.associate?.({ Stock, PurchaseRequestItem });
Stock.associate?.({ Product, Warehouse });
Warehouse.associate?.({ Stock, PurchaseRequest });
PurchaseRequest.associate?.({ Warehouse, PurchaseRequestItem });
PurchaseRequestItem.associate?.({ PurchaseRequest, Product });

const db: DBModels & { sequelize: Sequelize } = {
  Product,
  Stock,
  Warehouse,
  PurchaseRequest,
  PurchaseRequestItem,
  sequelize,
};

export default db;
