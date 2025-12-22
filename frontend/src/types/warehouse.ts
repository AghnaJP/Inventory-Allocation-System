export interface Warehouse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseList {
  data: Warehouse[];
}
