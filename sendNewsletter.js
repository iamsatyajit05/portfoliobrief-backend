require('dotenv').config();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
// const { client } = require('./mongodb');
const MONGODB_URI = process.env.MONGODB_URI;
const { MongoClient } = require('mongodb');
const { createTransport } = require('nodemailer');

function structureEmail(data) {
    let newsContent = "";

    for (let i = 0; i < data.news.length; i++) {
        const news = `<br><a href="${data.news[i].href}" target="_blank">${data.news[i].innerText}</a><br>`;
        newsContent += news;
    }

    const email = {
        'to': data.user,
        'subject': 'DailyBrief of Your Portfolio',
        'html': `Hey there, here is your dailybrief.<br><br><hr>${newsContent}<br><hr><br>The reason behind no css is this is made as toy version for buildspace.`
    }

    return email;
}

function sendEmail(data) {
    const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'thisissatyajit05@gmail.com',
        to: data.to,
        subject: data.subject,
        html: data.html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

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

async function fetchStocklist() {
    const client = new MongoClient(MONGODB_URI);
    const dbName = 'test';
    const collectionName = 'stocklists';

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
            const emailContent = await structureEmail(addToEmail)
            await sendEmail(emailContent)
        }
    }
    catch(err) {
        console.log("Error:", err);
    }
}

sendData();