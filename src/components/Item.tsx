import { faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { type Item, ItemStoreContext } from '../context/ItemStoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';

function Item({ item, refreshParent }: { item: Item; refreshParent: () => void }) {
  const ItemStore = useContext(ItemStoreContext);

  const [isEditing, setIsEditing] = useState(false);

  const [editedName, setEditedName] = useState(item.name);
  const [editedPrice, setEditedPrice] = useState(item.price);

  const startEditing = () => {
    setEditedPrice(item.price);
    setEditedName(item.name);
    setIsEditing(true);
  };

  const finishEditing = () => {
    setIsEditing(false);

    ItemStore.update(({ items }) => {
      items[item.id].name = editedName;
      items[item.id].price = editedPrice;
    });

    refreshParent();
  };

  const remove = () => {
    ItemStore.update(({ items }) => {
      delete items[item.id];
    });

    refreshParent();
  };

  return (
    <div className='gap-4 border-b-2 border-gray-400 h-10 flex items-center justify-between px-4'>
      {isEditing ? (
        <>
          <div className='flex items-center gap-4'>
            <FontAwesomeIcon icon={faTrash} className='text-red-500' onClick={remove} />

            <input
              className='bg-gray-200 text-gray-700 outline-none w-[40%]'
              type='text'
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
            />
            <input
              className='bg-gray-200 text-gray-700 outline-none w-[40%]'
              type='number'
              step='0.01'
              value={editedPrice}
              onChange={e => setEditedPrice(e.target.valueAsNumber)}
            />

            <FontAwesomeIcon icon={faCheck} size='lg' className='text-green-500' onClick={finishEditing} />
          </div>
        </>
      ) : (
        <>
          <p className='text-gray-700 select-none'>{item.name}</p>

          <div className='flex items-center gap-4'>
            <p className='text-green-500 select-none'>
              <span className='font-bold'>{item.price.toFixed(2)}</span> лв.
            </p>

            <FontAwesomeIcon icon={faPen} className='text-green-500' onClick={startEditing} />
          </div>
        </>
      )}
    </div>
  );
}

export { Item };
