import { PasswordPage } from '../pages/PasswordPage';
import { TablesPage } from '../pages/TablesPage';
import { ItemsPage } from '../pages/ItemsPage';
import { BillPage } from '../pages/BillPage';
import { createContext } from 'react';

type Route = { name: 'password' } | { name: 'tables' } | { name: 'items' } | { name: 'bill'; id: string };

const RouteComponents: Record<Route['name'], React.ReactNode> = {
  password: <PasswordPage />,
  tables: <TablesPage />,
  items: <ItemsPage />,
  bill: <BillPage />
};

const RouteContext = createContext<{
  route: Route;
  setRoute: (route: Route) => void;
}>({ route: { name: 'password' }, setRoute: () => {} });

export { RouteContext, RouteComponents };
export type { Route };
