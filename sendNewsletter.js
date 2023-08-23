require('dotenv').config();
const { mongoDBInstance } = require('./mongodb');
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

async function fetchNews() {
    try {
        const client = await mongoDBInstance.getClient();
        console.log('Connected successfully to server');

        const dbName = 'test';
        const collectionName = 'news';

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(9, 0, 0, 0);

        const filteredData = documents.filter(item => new Date(item.newsTime) > yesterday);
        return filteredData;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchStocklist() {
    try {
        const client = await mongoDBInstance.getClient();
        console.log('Connected successfully to server');

        const dbName = 'test';
        const collectionName = 'stocklists';

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();
        return documents;
    } catch (error) {
        console.error('Error:', error);
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

async function sendEmail(data) {
    try {
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
    } catch (error) {
        console.error('Error:', error);
    }
}

sendData();