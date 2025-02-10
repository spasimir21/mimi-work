import { createTableStore, TableStoreContext } from './context/TableStoreContext';
import { BillStoreContext, createBillStore } from './context/BillStoreContext';
import { createItemStore, ItemStoreContext } from './context/ItemStoreContext';
import { faBowlFood, faMoneyBills } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Route, RouteContext } from './context/RouteContext';
import { TablesPage } from './pages/TablesPage';
import { ItemsPage } from './pages/ItemsPage';
import { BillPage } from './pages/BillPage';
import { useMemo, useState } from 'react';

const TABLE_STORE = createTableStore();
const BILL_STORE = createBillStore();
const ITEM_STORE = createItemStore();

function App() {
  const [route, setRoute] = useState<Route>({ name: 'tables' });

  const routeName = useMemo(() => {
    if (route.name === 'tables') return 'Tables';
    if (route.name === 'items') return 'Items';

    return BILL_STORE.data.bills[route.id].name;
  }, [route]);

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      <ItemStoreContext.Provider value={ITEM_STORE}>
        <BillStoreContext.Provider value={BILL_STORE}>
          <TableStoreContext.Provider value={TABLE_STORE}>
            <div className='bg-white fixed bottom-0 left-0 w-screen flex h-16 border-t-2 border-gray-400 items-center justify-between text-green-500 px-5'>
              <FontAwesomeIcon icon={faMoneyBills} size='2xl' onClick={() => setRoute({ name: 'tables' })} />
              <p className='text-gray-700 text-lg select-none'>{routeName}</p>
              <FontAwesomeIcon icon={faBowlFood} size='2xl' onClick={() => setRoute({ name: 'items' })} />
            </div>
            {route.name === 'tables' ? <TablesPage /> : route.name === 'items' ? <ItemsPage /> : <BillPage />}
          </TableStoreContext.Provider>
        </BillStoreContext.Provider>
      </ItemStoreContext.Provider>
    </RouteContext.Provider>
  );
}

export default App;
