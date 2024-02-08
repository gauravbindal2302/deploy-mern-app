import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [list, setList] = useState([]);
  const [addItemText, setAddItemText] = useState("");
  const [editItemText, setEditItemText] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [list]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "https://deploy-mern-app-server.vercel.app/get"
      );
      setList(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAdd = async () => {
    if (addItemText) {
      try {
        await axios.post("https://deploy-mern-app-server.vercel.app/add", {
          itemName: addItemText,
        });
        setAddItemText(""); // Clear add input field after adding
        fetchItems(); // Fetch items after the state is updated
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleUpdate = async (itemName) => {
    try {
      await axios.put(
        `https://deploy-mern-app-server.vercel.app/update/${itemName}`,
        {
          updatedItemName: editItemText,
        }
      );
      setEditingItem(null); // Stop editing
      setEditItemText(""); // Clear edit input field
      fetchItems(); // Fetch items after the state is updated
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (itemName) => {
    setEditingItem(itemName); // Start editing the item
    const itemToEdit = list.find((item) => item.itemName === itemName);
    setEditItemText(itemToEdit.itemName); // Set edit input text to the item's current text
  };

  const handleRemove = async (itemName) => {
    try {
      await axios.delete(
        `https://deploy-mern-app-server.vercel.app/delete/${itemName}`
      );
      console.log("Item removed:", itemName);
      fetchItems(); // Fetch items after the state is updated
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="App">
      <h1>MERN App</h1>
      <div className="operations">
        <input
          type="text"
          placeholder="Enter text to add"
          value={addItemText}
          onChange={(e) => setAddItemText(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
        <button onClick={handlePrint}>Print this page</button>
      </div>
      {list.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Items</th>
              <th>Manage</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {editingItem === item.itemName ? (
                    <input
                      type="text"
                      value={editItemText}
                      onChange={(e) => setEditItemText(e.target.value)}
                    />
                  ) : (
                    item.itemName
                  )}
                </td>
                <td>
                  {editingItem === item.itemName ? (
                    <button onClick={() => handleUpdate(item.itemName)}>
                      Confirm
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(item.itemName)}>
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleRemove(item.itemName)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="no-items">No items to display.</h1>
      )}
    </div>
  );
}
