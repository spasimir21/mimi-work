import { faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { type Bill, BillStoreContext } from '../context/BillStoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemStoreContext } from '../context/ItemStoreContext';
import { RouteContext } from '../context/RouteContext';
import { useContext, useState } from 'react';

function Bill({ bill, refreshParent }: { bill: Bill; refreshParent: () => void }) {
  const BillStore = useContext(BillStoreContext);
  const ItemStore = useContext(ItemStoreContext);
  const { setRoute } = useContext(RouteContext);

  const [isEditing, setIsEditing] = useState(false);

  const [editedName, setEditedName] = useState(bill.name);

  const billPrice = Object.entries(bill.items).reduce(
    (total, [itemId, count]) => total + ItemStore.data.items[itemId].price * count,
    0
  );

  const itemsToServe = Object.entries(bill.itemsToServe ?? {}).reduce((total, [_, count]) => total + count, 0);

  const startEditing = () => {
    setEditedName(bill.name);
    setIsEditing(true);
  };

  const finishEditing = () => {
    setIsEditing(false);

    BillStore.update(({ bills }) => {
      bills[bill.id].name = editedName;
    });

    refreshParent();
  };

  const remove = () => {
    BillStore.update(({ bills }) => {
      delete bills[bill.id];
    });

    refreshParent();
  };

  return (
    <div
      className='gap-4 border-b-2 border-gray-400 h-10 flex items-center justify-between px-4'
      onClick={() => !isEditing && setRoute({ name: 'bill', id: bill.id })}>
      {isEditing ? (
        <>
          <div className='flex items-center gap-4'>
            <input
              className='bg-gray-200 text-gray-700 outline-none w-1/2'
              type='text'
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
            />

            {Object.keys(bill.items).length === 0 && (
              <FontAwesomeIcon icon={faTrash} className='text-red-500' onClick={remove} />
            )}
          </div>

          <FontAwesomeIcon icon={faCheck} size='lg' className='text-green-500' onClick={finishEditing} />
        </>
      ) : (
        <>
          <div className='flex items-center gap-2'>
            <p className='text-gray-700 select-none'>{bill.name}</p>
            {itemsToServe > 0 && (
              <div className='rounded-full text-white font-bold grid place-items-center w-6 h-6 bg-amber-400'>
                {itemsToServe}
              </div>
            )}
          </div>

          <div className='flex items-center gap-4'>
            <p className='text-green-500 select-none'>
              <span className='font-bold'>{billPrice.toFixed(2)}</span> лв.
            </p>

            <FontAwesomeIcon
              icon={faPen}
              className='text-green-500'
              onClick={e => (e.stopPropagation(), startEditing())}
            />
          </div>
        </>
      )}
    </div>
  );
}

export { Bill };
