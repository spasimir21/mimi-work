import { faAdd, faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TableStoreContext, type Table } from '../context/TableStoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BillStoreContext } from '../context/BillStoreContext';
import { useRefresh } from '../hooks/useRefresh';
import { useContext, useState } from 'react';
import { id } from '../utils/id';
import { Bill } from './Bill';

function Table({ table, refreshParent }: { table: Table; refreshParent: () => void }) {
  const TableStore = useContext(TableStoreContext);
  const BillStore = useContext(BillStoreContext);
  const refresh = useRefresh();

  const [isEditing, setIsEditing] = useState(false);

  const [editedName, setEditedName] = useState(table.name);

  const tableBills = Object.values(BillStore.data.bills).filter(bill => bill.tableId === table.id);

  const startEditing = () => {
    setEditedName(table.name);
    setIsEditing(true);
  };

  const finishEditing = () => {
    setIsEditing(false);

    TableStore.update(({ tables }) => {
      tables[table.id].name = editedName;
    });

    refreshParent();
  };

  const remove = () => {
    TableStore.update(({ tables }) => {
      delete tables[table.id];
    });

    refreshParent();
  };

  const addBill = () =>
    BillStore.update(({ bills }) => {
      const billId = id();
      bills[billId] = { id: billId, tableId: table.id, name: `Bill #${tableBills.length + 1}`, items: {} };

      refresh();
    });

  return (
    <div className='flex flex-col'>
      {isEditing ? (
        <div className='gap-4 border-b-2 border-gray-400 bg-gray-200 h-10 flex items-center px-4 justify-between'>
          <div className='flex items-center gap-4'>
            <FontAwesomeIcon icon={faAdd} size='lg' className='text-green-500' onClick={addBill} />
            <input
              className='bg-white outline-none w-1/2'
              type='text'
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
            />
            {tableBills.length === 0 && <FontAwesomeIcon icon={faTrash} className='text-red-500' onClick={remove} />}
          </div>

          <FontAwesomeIcon icon={faCheck} size='lg' className='text-green-500' onClick={finishEditing} />
        </div>
      ) : (
        <div className='gap-4 border-b-2 border-gray-400 bg-gray-200 h-10 flex items-center px-4 justify-between'>
          <p className='text-gray-700 select-none'>{table.name}</p>
          <FontAwesomeIcon icon={faPen} className='text-green-500' onClick={startEditing} />
        </div>
      )}

      {tableBills.map(bill => (
        <Bill key={bill.id} bill={bill} refreshParent={refresh} />
      ))}
    </div>
  );
}

export { Table };
