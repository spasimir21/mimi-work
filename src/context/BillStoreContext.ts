import { createContext } from 'react';
import { Store } from '../store/Store';

interface Bill {
  id: string;
  tableId: string;
  name: string;
  items: Record<string, number>;
}

interface BillStoreData {
  bills: Record<string, Bill>;
}

const BillStoreContext = createContext<Store<BillStoreData>>(null as any);

const createBillStore = () => new Store<BillStoreData>('$$bills', { bills: {} });

export { BillStoreContext, createBillStore };
export type { Bill, BillStoreData };
