require('dotenv').config();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { client } = require('./mongodb');
const MONGODB_URI = process.env.MONGODB_URI;
const { MongoClient } = require('mongodb');

async function fetchNews() {
    const dbName = 'test';       
    const collectionName = 'news'; 

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(9, 0, 0, 0);

        const filteredData = documents.filter(item => new Date(item.newsTime) > yesterday);
        //       console.log('Fetched documents:', filteredData);
        return filteredData;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

//fetchNews();




async function fetchStocklist() {
    const client = new MongoClient(MONGODB_URI);
    const dbName = 'test';       // Replace with your database name
    const collectionName = 'stocklists'; // Replace with your collection name

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();
        // console.log('Fetched documents:', documents);
        return documents;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

async function sendData() {
    const stocklist = await fetchStocklist();
    const news = await fetchNews();
    try {
        for (let i = 0; i < stocklist.length; i++) {
            const addToEmail = {
                'user': stocklist[i].userEmail,
                'stockslist': stocklist[i].selectedStocks,
                'news': []
            };

            for (let j = 0; j < news.length; j++) {
                for (let k = 0; k <= stocklist[i].selectedStocks.length; k++) {
                        if (stocklist[i].selectedStocks[k] == news[j].tag) {
                        console.log(stocklist[i].selectedStocks[k], news[j].tag);

                        addToEmail.news.push(news[j]);

                    }
                }
            }
            console.log("this is ", addToEmail);
        }
    }
    catch {
        console.log("over");
    }
}

sendData();