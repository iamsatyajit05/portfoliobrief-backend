require('dotenv').config();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { client } = require('./mongodb')
const { MongoClient } = require('mongodb');
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
    const dbName = 'test';
    const collectionName = 'stocklists';

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({ userEmail }).toArray();
        return documents;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}
async function updateStocks(email) {
    try {
        const documents = await fetchStocklist(email);
        if (typeof documents === "undefined") {
            return [];
        }

        const listedStocks = [];

        for (let i = 0; i < documents.length; i++) {
            if (documents[i].userEmail === email) {
                listedStocks.push(documents[i]);
            }
        }

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


async function updateField(documentId, updatedValue) {
    const dbName = 'test';
    const collectionName = 'stocklists';

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filter = { _id: documentId };
        const update = { $set: { selectedStocks: updatedValue } };

        const result = await collection.updateOne(filter, update);

        console.log(`${result.modifiedCount} document(s) updated.`);
        return { status: true };
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

async function stockSaveToDB(stocksList, email) {
    const dbName = 'test';
    const collectionName = 'stocklists';

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const record = await fetchEmail(email);

        if (record[0] && record[0].userEmail === email) {
            const response = await updateField(record[0]._id, stocksList);
            return response;
        } else {
            const newStockList = {
                selectedStocks: stocksList,
                userEmail: email,
            };

            const result = await collection.insertOne(newStockList);

            console.log(`${result.insertedCount} document(s) inserted.`);
            return { status: true, user: result.ops[0] };
        }
    } catch (err) {
        console.error('An error occurred:', err);
        return { status: false, error: err.message };
    } finally {
        client.close();
    }
}

async function fetchedNews() {
    const url = MONGODB_URI;
    const dbName = 'test';
    const collectionName = 'new.s';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();

        const filteredData = await collection.find({}).toArray();;
        // console.log('Fetched documents:', filteredData);
        return filteredData;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

async function savePreference({ receiveNewsText, newsTypeText, email }) {
    const dbName = 'test';
    const collectionName = 'stocklists';

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const record = await fetchEmail(email);

        if (record[0] && record[0].userEmail === email) {
            const filter = { _id: record[0]._id };
            const update = { $set: { recieveNews: receiveNewsText, newsType: newsTypeText } };

            const result = await collection.updateOne(filter, update);

            console.log(`${result.modifiedCount} document(s) updated.`);
        }

        return { status: true, message: 'saved done' };
    } catch (error) {
        return { status: false, message: error };
    } finally {
        client.close();
    }
}

module.exports = { stockSaveToDB, updateStocks, savePreference, fetchedNews };
