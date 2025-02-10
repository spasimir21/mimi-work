import { createContext } from 'react';

type Route = { name: 'tables' } | { name: 'items' } | { name: 'bill'; id: string };

const RouteContext = createContext<{
  route: Route;
  setRoute: (route: Route) => void;
}>({ route: { name: 'tables' }, setRoute: () => {} });

export { RouteContext };
export type { Route };
