require('dotenv').config();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { client } = require('./mongodb');
const MONGODB_URI = process.env.MONGODB_URI;
const { MongoClient } = require('mongodb');

async function fetchNews() {
    const client = new MongoClient(MONGODB_URI);
    const dbName = 'test';
    const collectionName = 'news';

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();

/*        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(9, 0, 0, 0);

        const filteredData = documents.filter(item => new Date(item.newsTime) > yesterday);
        */const filteredData = await collection.find({}).toArray();;
              console.log('Fetched documents:', filteredData[0].tag);
        return filteredData;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

/*async function sendData() {
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
  //          const emailContent = await structureEmail(addToEmail)
//            await sendEmail(emailContent)
        }
    }
    catch(err) {
        console.log("Error:", err);
       }
}
sendData();*/
//const Stocks = mongoose.model('stocklist', stocklistSchema);

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
        const documents = await collection.find({userEmail}).toArray();
        console.log(6);
        //console.log('Fetched documents:', documents);
        console.log(userEmail);
        return documents;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}
async function userNews(email) {
    console.log("updateStocks calling");
    console.log(1);
    try {
        const documents = await fetchStocklist(email);
        const news=await fetchNews();
        var listedStocks;
        //console.log("Documents from main function", documents);
        for (let i = 0; i < documents.length; i++) {
            if (documents[i].userEmail == email) {
                listedStocks = documents[i].selectedStocks;
            }
        }
        
        const userNews=[];
        console.log("Stocks:", listedStocks);
        console.log("news tags",news[0].tag);
        console.log(news.length);
        for(let i=0;i<=5;i++){
            
            for(let j=0;j<=listedStocks.length;j++){
                
                if(news[i].tag == listedStocks[j]){
                        userNews.push(news[i]);
                }
                
            }
        }
// console.log(userNews);
        return userNews;
    }
    catch (error) {
        console.error('Error:', error);
    }/* finally {
        client.close();
    }*/
}

module.exports={userNews};
