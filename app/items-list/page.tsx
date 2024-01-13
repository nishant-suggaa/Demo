"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { fetchItems, createItem } from '../../app/api';

interface Item {
  id: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  item_category: string;
}

const ItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('');

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

    // Create a new item with the entered name and category
    const newItem = await createItem({
      item_name: newItemName,
      item_category: newItemCategory,
      // Do not include "id" in the input data
    });

    // Update the items state to include the new item
    setItems([...items, newItem]);

    // Clear the input fields
    setNewItemName('');
    setNewItemCategory('');
  };

  console.log(items);

  return (
    <div>
      <h1>Items List</h1>

      <form onSubmit={handleSubmit}>
        <label>
          New Item Name:
          <input className="m-2 border-blue-200 border" type="text" name="item_name" value={newItemName} onChange={handleInputChange} />
        </label>
        <label>
          New Item Category:
          <input className='border border-blue-200 m-2' type="text" name="item_category" value={newItemCategory} onChange={handleInputChange} />
        </label>
        <button className="bg-blue-200 p-1 rounded-lg" type="submit">Add Item</button>
      </form>

      <div>
        {items.map((item) => (
          <div key={item.id} className="m-2 p-2 border border-blue-200 rounded-lg">
            <p>Item Name: {item.item_name}</p>
            <p>Item Category: {item.item_category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
