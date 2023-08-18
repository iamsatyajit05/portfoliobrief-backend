require('dotenv').config();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { client } = require('./mongodb')
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });


const stocklistSchema = new mongoose.Schema({
    selectedStocks: [String],
    userEmail: String,
});

const Stocks = mongoose.model('stocklist', stocklistSchema);

async function fetchStocklist(userEmail) {
    const client = new MongoClient(MONGODB_URI);
    const dbName = 'test';       // Replace with your database name
    const collectionName = 'stocklists'; // Replace with your collection name

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        console.log(5);
        const documents = await collection.find({ userEmail }).toArray();
        console.log(6);
        console.log('Fetched documents:', documents);
        return documents;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}
async function updateStocks(email) {
    console.log("updateStocks calling");
    console.log(1);
    try {
        const documents = await fetchStocklist(email);
        const listedStocks = [];
        console.log("Documents from main function", documents);
        for (let i = 0; i < documents.length; i++) {
            if (documents[i].userEmail === email) {
                listedStocks.push(documents[i]);
            }
        }
        console.log("Stocks:", listedStocks);
        return listedStocks;
    }
    catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

async function fetchEmail(userEmail) {
    const dbName = 'test';
    const session = client.startSession();
    const db = client.db(dbName);

    // Your data fetching code here
    const collection = db.collection('stocklists');

    const email = userEmail;

    const documents = await collection.find({ userEmail }).toArray();
    console.log('Fetched documents:', documents);
    return documents;
}

const { MongoClient } = require('mongodb');

async function updateField(documentId, updatedValue) {
    const url = MONGODB_URI; // Replace with your MongoDB server URL
    const dbName = 'test';       // Replace with your database name
    const collectionName = 'stocklists'; // Replace with your collection name

    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filter = { _id: documentId }; // Replace with the actual field to identify the document
        console.log(filter);
        const update = { $set: { selectedStocks: updatedValue } }; // Replace fieldName with the actual field name
        console.log(filter);

        const result = await collection.updateOne(filter, update);
        console.log(result);

        console.log(`${result.modifiedCount} document(s) updated.`);
        return { status: true };
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

async function stockSaveToDB(stocksList, email) {
    console.log("stockdb function calling");
    const record = await fetchEmail(email)
    if (record[0] && record[0].userEmail == email) {
        console.log("Update")
        const response = await updateField(record[0]._id, stocksList)
        return response;
    } else {
        try {
            const newStockList = new Stocks({
                selectedStocks: stocksList,
                userEmail: email,
            });

            const data = await newStockList.save();

            return { status: true, user: data };
        } catch (err) {
            console.error('An error occurred:', err);
            return { status: false, error: err.message };
        }
    }
}

module.exports = {stockSaveToDB, updateStocks};
