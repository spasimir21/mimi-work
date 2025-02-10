import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemStoreContext } from '../context/ItemStoreContext';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../components/Catgory';
import { useRefresh } from '../hooks/useRefresh';
import { useContext } from 'react';
import { id } from '../utils/id';

function ItemsPage() {
  const ItemStore = useContext(ItemStoreContext);
  const refresh = useRefresh();

  const addCategory = () =>
    ItemStore.update(({ categories }) => {
      const categoryId = id();
      categories[categoryId] = { id: categoryId, name: `Category #${Object.keys(categories).length + 1}` };

      refresh();
    });

  return (
    <div className='flex flex-col'>
      <div
        className='bg-white fixed bottom-18 right-2 z-99 rounded-full w-10 h-10 border-2 border-gray-400 grid place-items-center'
        onClick={addCategory}>
        <FontAwesomeIcon icon={faAdd} size='xl' className='text-green-500' />
      </div>

      {Object.keys(ItemStore.data.categories).length === 0 ? (
        <p className='text-gray-700 text-center pt-4'>No items.</p>
      ) : (
        Object.values(ItemStore.data.categories).map(category => (
          <Category key={category.id} category={category} refreshParent={refresh} />
        ))
      )}

      <div className='h-30'></div>
    </div>
  );
}

export { ItemsPage };
