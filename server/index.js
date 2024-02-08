import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const server = express();

server.use(cors());
server.use(express.json());
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT;
const DB = process.env.DATABASE;

// Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Create a schema and model for item
const itemSchema = new mongoose.Schema({
  itemName: String,
});
const Item = mongoose.model("items", itemSchema);

// Route for adding item
server.post("/add", async (req, res) => {
  const { itemName } = req.body;
  try {
    const newItem = new Item({ itemName });
    await newItem.save();
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

// Route for getting all items
server.get("/get", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

// Route for updating an item
server.put("/update/:itemName", async (req, res) => {
  const { itemName } = req.params;
  const { updatedItemName } = req.body;
  try {
    await Item.findOneAndUpdate({ itemName }, { itemName: updatedItemName });
    res.status(200).send("Item updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating item");
  }
});

// Route for deleting an item
server.delete("/delete/:itemName", async (req, res) => {
  const { itemName } = req.params;
  try {
    await Item.deleteOne({ itemName });
    res.status(200).send("Item deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting item");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
