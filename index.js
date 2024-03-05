/**
 * Expense Tracker
 * Adding a new expense/income:/add-expense / means end points->post
 * Display existing expense:/get-expense ->get
 * Editing exiting entries:/edit-expense ->patch/put
 * Deleting expense:/delete-expense ->delete
 * 
 * Budget reporting
 * creating new user
 * validating user
 * editing existing entires
 * 
 * 
 *Defining schema
 category,amount,date
 */
 const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line
const { Expense } = require("./schema.js");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://Meganathan:Meganathan2005@cluster0.nozftxd.mongodb.net/your-database-name?retryWrites=true&w=majority&appName=Cluster0');

        const port = 8000;
        app.listen(port, function () {
            console.log(`Listening on port ${port}...`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDb();

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: err.message,
    });
});

app.post('/add-expense', async function (req, res) {
    try {
        await Expense.create({
            "amount": req.body.amount,
            "category": req.body.category,
            "date": req.body.date
        });
        res.status(201).json({
            status: 'success',
            message: 'Entry created',
            expense: "newExpense"
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({
            "status": 'failure',
            "message": 'Entry not created',
            "error": error
        });
    }
});

app.get('/get-expense', async function (req, res) {
    try {
        const expenseData = await Expense.find();
        res.status(200).json(expenseData);
    } catch (error) {
        res.status(500).json({
            "status": 'failure',
            "message": 'Error fetching expenses',
            "error": error
        });
    }
});

app.delete('/delete-expense/:id', async function (req, res) {
    try {
        const edata = await Expense.findById(req.params.id);
        if (edata) {
            await Expense.findByIdAndDelete(req.params.id);
            res.status(200).json({ "status": "successfully deleted" });
        } else {
            res.status(404).json({ "status": "not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "status": "failure", "message": "Error occurred while deleting the entry" });
    }
});

app.patch('/edit-expense/:id', async function (req, res) {
    try {
        const expenseEntry = await Expense.findById(req.params.id);

        if (expenseEntry) {
            await expenseEntry.updateOne({
                "amount": req.body.amount,
                "category": req.body.category,
                "date": req.body.date
            });

            res.status(200).json({
                "status": "success",
                "message": "Update entry"
            });
        } else {
            res.status(404).json({
                "status": "failure",
                "message": "Could not find the entry to update"
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": "failure",
            "message": "Error occurred while updating the entry"
        });
    }
});
