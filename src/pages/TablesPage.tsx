import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TableStoreContext } from '../context/TableStoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BillStoreContext } from '../context/BillStoreContext';
import { ItemStoreContext } from '../context/ItemStoreContext';
import { useRefresh } from '../hooks/useRefresh';
import { useContext, useState } from 'react';
import { Table } from '../components/Table';
import { id } from '../utils/id';

function TablesPage() {
  const TableStore = useContext(TableStoreContext);
  const BillStore = useContext(BillStoreContext);
  const ItemStore = useContext(ItemStoreContext);
  const refresh = useRefresh();

  const [clearInfo, setClearInfo] = useState({ count: 0, lastTime: null as number | null });

  const totalRevenue = Object.values(BillStore.data.bills)
    .map(bill =>
      Object.entries(bill.items).reduce(
        (total, [itemId, count]) => total + ItemStore.data.items[itemId].price * count,
        0
      )
    )
    .reduce((total, billPrice) => total + billPrice, 0);

  const addTable = () =>
    TableStore.update(({ tables }) => {
      const tableId = id();
      tables[tableId] = { id: tableId, name: `Table #${Object.keys(tables).length + 1}` };

      refresh();
    });

  const clear = () => {
    TableStore.update(store => (store.tables = {}));
    BillStore.update(store => (store.bills = {}));
    refresh();
  };

  const onClearClicked = () => {
    if (clearInfo.lastTime == null || Date.now() - clearInfo.lastTime > 500) {
      setClearInfo({ count: 1, lastTime: Date.now() });
      return;
    }

    if (clearInfo.count >= 9) {
      clear();
      setClearInfo({ count: 0, lastTime: null });
      return;
    }

    setClearInfo({ count: clearInfo.count + 1, lastTime: Date.now() });
  };

  return (
    <div className='flex flex-col'>
      <div
        className='bg-white fixed bottom-18 right-2 z-99 rounded-full w-10 h-10 border-2 border-gray-400 grid place-items-center'
        onClick={addTable}>
        <FontAwesomeIcon icon={faAdd} size='xl' className='text-green-500' />
      </div>

      <div
        className='bg-white fixed bottom-18 left-2 z-99 w-10 h-10 grid place-items-center rounded-full border-2 border-gray-400'
        onClick={onClearClicked}>
        <FontAwesomeIcon icon={faTrash} size='lg' className='text-red-500' />
      </div>

      {Object.keys(TableStore.data.tables).length === 0 ? (
        <p className='text-gray-700 text-center pt-4'>No tables.</p>
      ) : (
        <>
          {Object.values(TableStore.data.tables).map(table => (
            <Table key={table.id} table={table} refreshParent={refresh} />
          ))}

          <div className='gap-4 border-b-2 border-gray-400 bg-gray-200 h-10 flex items-center px-4 justify-between'>
            <p className='text-gray-700 select-none font-bold'>Revenue</p>

            <p className='text-green-500 select-none'>
              <span className='font-bold'>{totalRevenue.toFixed(2)}</span> лв.
            </p>
          </div>
        </>
      )}

      <div className='h-30'></div>
    </div>
  );
}

export { TablesPage };
