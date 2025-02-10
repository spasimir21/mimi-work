import { Store } from '../store/Store';
import { createContext } from 'react';

interface Table {
  id: string;
  name: string;
}

interface TableStoreData {
  tables: Record<string, Table>;
}

const TableStoreContext = createContext<Store<TableStoreData>>(null as any);

const createTableStore = () => new Store<TableStoreData>('$$tables', { tables: {} });

export { TableStoreContext, createTableStore };
export type { Table, TableStoreData };
