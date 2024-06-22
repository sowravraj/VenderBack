const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Simple route for the root URL
app.get("/", (req, res) => {
    res.send("PulsePicks");
});

// Connecting to MongoDB
mongoose.connect("mongodb+srv://sowravraj:HQWCj6Bs6C9IMMN8@cluster0.k71vwlq.mongodb.net/PulsePicks")
.then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err.message);
});

// Creating a Schema
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    buyingLink: {
        type: String,
        required: true
    },
    reviewLink: {
        type: String,
        required: true
    }
});

// Creating a Model
const listModel = mongoose.model("list", listSchema);

// Route to create a new list
app.post("/lists", async(req, res) => {
    const { title, buyingLink, reviewLink } = req.body;  // Destructure the request body

    try {
        const newList = new listModel({ title, buyingLink, reviewLink });
        await newList.save();
        res.status(201).send(newList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to get all lists
app.get("/lists", async (req, res) => {
    try {
        const lists = await listModel.find();
        res.status(200).send(lists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to update a list
app.put("/lists/:id", async(req, res) => {
    const { title, buyingLink, reviewLink } = req.body;
    const id = req.params.id;

    try {
        const updatedList = await listModel.findByIdAndUpdate(
            id,
            { title, buyingLink, reviewLink },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).json({ message: "List not found" });
        }
        res.status(200).json(updatedList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a list
app.delete('/lists/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await listModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(8000, () => {
    console.log("Server is connected on port 8000");
})
