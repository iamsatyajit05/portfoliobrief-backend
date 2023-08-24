require('dotenv').config();
const { mongoDBInstance } = require('./mongodb');

async function fetchNews() {
    try {
        const client = await mongoDBInstance.getClient();

        const dbName = 'test';
        const collectionName = 'news';

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();

        const filteredData = await collection.find({}).toArray();
        
        return filteredData;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchStocklist(userEmail) {
    try {
        const client = await mongoDBInstance.getClient();

        const dbName = 'test';
        const collectionName = 'stocklists';

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({ userEmail }).toArray();

        return documents;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function userNews(email) {
    try {
        const documents = await fetchStocklist(email);
        const news = await fetchNews();
        var listedStocks = [];

        for (let i = 0; i < documents.length; i++) {
            if (documents[i].userEmail == email) {
                listedStocks = documents[i].selectedStocks;
            }
        }

        const userNews = [];

        for (let i = 0; i <= 5; i++) {
            for (let j = 0; j <= listedStocks.length; j++) {
                if (news[i].tag == listedStocks[j]) {
                    userNews.push(news[i]);
                }
            }
        }

        return userNews;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { userNews };