// Intentionally centralized all models
import { Sequelize, DataTypes } from 'sequelize';
import ProductModelDefiner from '../v1/product/model/Product';
import StockModelDefiner from '../v1/stock/model/Stock';
import WarehouseModelDefiner from '../v1/warehouse/model/Warehouse';
import PurchaseRequestModelDefiner from '../v1/purchase-request/model/PurchaseRequest';
import PurchaseRequestItemModelDefiner from '../v1/purchase-request/model/PurchaseRequestItem';

const sequelize = new Sequelize(process.env.DATABASE_URL!, { dialect: 'postgres' });

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

export default { Product, Stock, Warehouse, PurchaseRequest, PurchaseRequestItem, sequelize };
