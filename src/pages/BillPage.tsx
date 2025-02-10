import { faAdd, faArrowLeft, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemStoreContext } from '../context/ItemStoreContext';
import { BillStoreContext } from '../context/BillStoreContext';
import { RouteContext } from '../context/RouteContext';
import { useRefresh } from '../hooks/useRefresh';
import { useContext, useState } from 'react';

function BillPage() {
  const BillStore = useContext(BillStoreContext);
  const ItemStore = useContext(ItemStoreContext);
  const { route } = useContext(RouteContext);

  const refresh = useRefresh();

  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');

  const bill = BillStore.data.bills[(route as any).id];

  const billPrice = Object.entries(bill.items).reduce(
    (total, [itemId, count]) => total + ItemStore.data.items[itemId].price * count,
    0
  );

  const items = Object.values(ItemStore.data.items).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = (itemId: string) =>
    BillStore.update(({ bills }) => {
      const bill = bills[(route as any).id];

      if (itemId in bill.items) bill.items[itemId]++;
      else bill.items[itemId] = 1;

      refresh();
    });

  const subItem = (itemId: string) =>
    BillStore.update(({ bills }) => {
      const bill = bills[(route as any).id];

      if (itemId in bill.items) bill.items[itemId]--;

      if (bill.items[itemId] === 0) delete bill.items[itemId];

      refresh();
    });

  if (isAdding)
    return (
      <div className='flex flex-col'>
        <div className='flex items-center border-b-2 border-gray-400 bg-gray-200 px-2 py-2 gap-2'>
          <FontAwesomeIcon icon={faArrowLeft} className='text-gray-700' size='xl' onClick={() => setIsAdding(false)} />
          <input
            type='text'
            className='grow text-lg outline-none bg-white px-2 rounded-sm'
            placeholder='Item'
            value={search}
            onInput={e => setSearch((e.target as any).value)}
          />
        </div>

        {items.length === 0 ? (
          <div className='flex flex-col items-center pt-2'>
            <p className='text-gray-700 select-none'>No items found.</p>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className='flex items-center border-b-2 border-gray-400 px-4 py-2 justify-between'
              onClick={() => (addItem(item.id), setIsAdding(false))}>
              <p className='text-gray-700'>{item.name}</p>

              <p className='text-green-500 select-none'>
                <span className='font-bold'>{item.price.toFixed(2)}</span> лв.
              </p>
            </div>
          ))
        )}

        <div className='h-30'></div>
      </div>
    );

  return (
    <div className='flex flex-col'>
      <div
        className='bg-white fixed bottom-18 right-2 z-99 rounded-full w-10 h-10 border-2 border-gray-400 grid place-items-center'
        onClick={() => (setSearch(''), setIsAdding(true))}>
        <FontAwesomeIcon icon={faAdd} size='xl' className='text-green-500' />
      </div>

      {Object.entries(bill.items).map(([itemId, count], i) => {
        const item = ItemStore.data.items[itemId];

        return (
          <div
            key={itemId}
            className={`flex items-center justify-between border-b-2 border-gray-400 px-4 py-2 ${
              i % 2 == 1 ? 'bg-gray-100' : ''
            }`}>
            <div className='w-1/4 flex items-center'>
              <p className='text-gray-700'>{item.name}</p>
            </div>

            <div className='w-1/4 flex items-center justify-center'>
              <p className='text-green-500 select-none'>
                <span className='font-bold'>{item.price.toFixed(2)}</span> лв.
              </p>
            </div>

            <div className='flex items-center w-1/4 justify-center'>
              <div className='flex items-center gap-2'>
                <div
                  className='bg-white rounded-full w-6 h-6 border-2 border-gray-400 grid place-items-center'
                  onClick={() => subItem(item.id)}>
                  <FontAwesomeIcon icon={faMinus} className='text-green-500' />
                </div>

                <p className='text-gray-700'>{count}</p>

                <div
                  className='bg-white rounded-full w-6 h-6 border-2 border-gray-400 grid place-items-center'
                  onClick={() => addItem(item.id)}>
                  <FontAwesomeIcon icon={faAdd} className='text-green-500' />
                </div>
              </div>
            </div>

            <div className='w-1/4 flex items-center justify-end'>
              <p className='text-green-500 select-none'>
                <span className='font-bold'>{(item.price * count).toFixed(2)}</span> лв.
              </p>
            </div>
          </div>
        );
      })}

      <div className='gap-4 border-b-2 border-gray-400 bg-gray-200 h-10 flex items-center justify-between px-4'>
        <p className='text-gray-700 select-none font-bold'>Total</p>

        <p className='text-green-500 select-none'>
          <span className='font-bold'>{billPrice.toFixed(2)}</span> лв.
        </p>
      </div>

      <div className='h-30'></div>
    </div>
  );
}

export { BillPage };
