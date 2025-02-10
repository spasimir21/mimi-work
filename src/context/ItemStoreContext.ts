import { Store } from '../store/Store';
import { createContext } from 'react';

interface ItemCategory {
  id: string;
  name: string;
}

interface Item {
  id: string;
  categoryId: string;
  name: string;
  price: number;
}

interface ItemStoreData {
  categories: Record<string, ItemCategory>;
  items: Record<string, Item>;
}

const ItemStoreContext = createContext<Store<ItemStoreData>>(null as any);

const createItemStore = () => new Store<ItemStoreData>('$$items', { categories: {}, items: {} });

export { ItemStoreContext, createItemStore };
export type { Item, ItemCategory, ItemStoreData };
