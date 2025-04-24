import { TableStoreContext } from '../context/TableStoreContext';
import { ItemStoreContext } from '../context/ItemStoreContext';
import { BillStoreContext } from '../context/BillStoreContext';
import { useContext, useEffect, useState } from 'react';
import { RouteContext } from '../context/RouteContext';

function PasswordPage() {
  const tableStore = useContext(TableStoreContext);
  const billStore = useContext(BillStoreContext);
  const itemStore = useContext(ItemStoreContext);

  const { setRoute } = useContext(RouteContext);

  const [isTrying, setIsTrying] = useState(false);
  const [password, setPassword] = useState('');

  const tryPassword = async (password: string) => {
    if (isTrying) return;
    setIsTrying(true);

    tableStore.password = password;
    billStore.password = password;
    itemStore.password = password;

    if ((await tableStore.load()) && (await billStore.load()) && (await itemStore.load())) {
      localStorage.setItem('password', password);
      setRoute({ name: 'tables' });
    } else {
      localStorage.clear();
      setPassword('');
    }

    setIsTrying(false);
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem('password');
    if (savedPassword == null) return;

    setPassword(savedPassword);
    tryPassword(savedPassword);
  }, []);

  return (
    <div className='grid place-items-center w-screen h-screen'>
      <div className='flex flex-col items-center gap-6'>
        <input
          className='text-gray-700 outline-none border-1 rounded-md border-gray-400 px-2 py-1 text-lg'
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword((e.target as any).value)}
        />

        <button
          className={`${isTrying ? 'opacity-50' : ''} bg-green-500 text-white text-xl py-1 px-5 rounded-md`}
          onClick={() => tryPassword(password)}>
          Enter
        </button>
      </div>
    </div>
  );
}

export { PasswordPage };
