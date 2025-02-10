import { faAdd, faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ItemCategory, ItemStoreContext } from '../context/ItemStoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRefresh } from '../hooks/useRefresh';
import { useContext, useState } from 'react';
import { id } from '../utils/id';
import { Item } from './Item';

function Category({ category, refreshParent }: { category: ItemCategory; refreshParent: () => void }) {
  const ItemStore = useContext(ItemStoreContext);
  const refresh = useRefresh();

  const [isEditing, setIsEditing] = useState(false);

  const [editedName, setEditedName] = useState(category.name);

  const categoryItems = Object.values(ItemStore.data.items).filter(item => item.categoryId === category.id);

  const startEditing = () => {
    setEditedName(category.name);
    setIsEditing(true);
  };

  const finishEditing = () => {
    setIsEditing(false);

    ItemStore.update(({ categories }) => {
      categories[category.id].name = editedName;
    });

    refreshParent();
  };

  const remove = () => {
    ItemStore.update(({ categories }) => {
      delete categories[category.id];
    });

    refreshParent();
  };

  const addItem = () =>
    ItemStore.update(({ items }) => {
      const itemId = id();
      items[itemId] = { id: itemId, categoryId: category.id, name: `Item #${categoryItems.length + 1}`, price: 1.23 };

      refresh();
    });

  return (
    <div className='flex flex-col'>
      {isEditing ? (
        <div className='gap-4 border-b-2 border-gray-400 bg-gray-200 h-10 flex items-center px-4 justify-between'>
          <div className='flex items-center gap-4'>
            <FontAwesomeIcon icon={faAdd} size='lg' className='text-green-500' onClick={addItem} />
            <input
              className='bg-white outline-none w-1/2'
              type='text'
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
            />
            {categoryItems.length === 0 && <FontAwesomeIcon icon={faTrash} className='text-red-500' onClick={remove} />}
          </div>

          <FontAwesomeIcon icon={faCheck} size='lg' className='text-green-500' onClick={finishEditing} />
        </div>
      ) : (
        <div className='gap-4 border-b-2 border-gray-400 bg-gray-200 h-10 flex items-center px-4 justify-between'>
          <p className='text-gray-700 select-none'>{category.name}</p>
          <FontAwesomeIcon icon={faPen} className='text-green-500' onClick={startEditing} />
        </div>
      )}

      {categoryItems.map(item => (
        <Item key={item.id} item={item} refreshParent={refresh} />
      ))}
    </div>
  );
}

export { Category };
