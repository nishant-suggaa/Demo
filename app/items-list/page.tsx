// ItemsList.tsx
"use client";
import { useEffect, useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from '../../app/api';

interface Item {
  id: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  item_category: string;
  onDelete: () => void;
}

const ItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [editItemId, setEditItemId] = useState<string | null>(null);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    await deleteItem(itemId);
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  }, [items]);

  const handleUpdateItem = useCallback(async (itemId: string) => {
    try {
      await updateItem(itemId, { item_name: newItemName, item_category: newItemCategory });
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, item_name: newItemName, item_category: newItemCategory } : item
      );
      setItems(updatedItems);
      setEditItemId(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }, [items, newItemName, newItemCategory]);

  useEffect(() => {
    const fetchData = async () => {
      const itemsData = await fetchItems();
      setItems(itemsData);
    };

    fetchData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'item_name') {
      setNewItemName(e.target.value);
    } else if (e.target.name === 'item_category') {
      setNewItemCategory(e.target.value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newItemName || !newItemCategory) {
      setError('Both fields are required');
      return;
    }

    setError('');

    const newItem = await createItem({
      item_name: newItemName,
      item_category: newItemCategory,
    });

    setItems([...items, { ...newItem, onDelete: () => handleDeleteItem(newItem.id) }]);

    setNewItemName('');
    setNewItemCategory('');
  };

  return (
    <div>
      <div className='flex h-20 bg-gradient-to-r from-pink-400 via-orange-200 to-orange-100 justify-center items-center w-full'>
        <h1 className=' border-spacing-7 p-2 rounded-lg bg-gradient-to-r from-pink-400 via-orange-200 to-orange-100'>Items List</h1>
      </div>
      <div className='bg-gradient-to-r from-pink-400 via-orange-200 to-orange-100'>
        <form onSubmit={handleSubmit}>
          <label>
            New Item Name:
            <input className="m-2 bg-gradient-to-l from-pink-400 via-orange-200 to-orange-100" type="text" name="item_name" value={newItemName} onChange={handleInputChange} />
          </label>
          <label>
            New Item Category:
            <input className='border bg-gradient-to-l from-pink-400 via-orange-200 to-orange-100 m-2' type="text" name="item_category" value={newItemCategory} onChange={handleInputChange} />
          </label>
          <button className="bg-gradient-to-l from-pink-400 via-orange-200 to-orange-100 p-1 m-2 rounded-lg" type="submit">Add Item</button>
        </form>
        {error && <p className="p-4 border-rose-500 text-white">{error}</p>}
      </div>

      <div className='bg-gradient-to-r from-pink-400 via-orange-200 to-orange-100'>
        {items.map((item) => (
          <div key={item.id} className="p-4 border border-red-200 rounded-lg">
            {editItemId === item.id ? (
              <div>
                <label>
                  Edit Item Name:
                  <input
                    type="text"
                    name="item_name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </label>
                <label>
                  Edit Item Category:
                  <input
                    type="text"
                    name="item_category"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  />
                </label>
                <button className="bg-blue-500 text-white p-1 m-1 rounded" onClick={() => handleUpdateItem(item.id)}>Save</button>
              </div>
            ) : (
              <div>
                <p>Item Name: {item.item_name}</p>
                <p>Item Category: {item.item_category}</p>
                <button className="bg-red-500 text-white p-1 m-1 rounded" onClick={item.onDelete}>Delete</button>
                <button className="bg-green-500 text-white p-1 m-1 rounded" onClick={() => setEditItemId(item.id)}>Update</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
