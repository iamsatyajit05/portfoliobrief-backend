// Senior Developer: ChatGPT
// Intern: Satyajit
require('dotenv').config();
const puppeteer = require("puppeteer");
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
const companies = require('./companyList'); const { mongoDBInstance } = require('./mongodb');

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

const allNews = [];

async function scrapeData(para) {
    return new Promise(async resolve => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        try {
            await page.goto(`https://www.livemint.com/companies${para}`, { waitUntil: 'networkidle2' });

            const mainSec = await page.$('.mainSec');
            const myListView = await mainSec.$('#mylistView');
            const listToStoryElements = await myListView.$$('.listtostory');

            const extractedData = [];

            const newsHeadline = await myListView.$('.cardHolder > div > .headline');
            const newsLinkElement = await newsHeadline.$('a');
            const newsInnerText = await newsHeadline.evaluate(a => a.innerText);
            const newsHref = await newsLinkElement.evaluate(a => a.getAttribute('href'));

            const newsTimeParent = await myListView.$('.cardHolder > div > article > span > span');
            const newsUpdatedTime = await newsTimeParent.evaluate(span => span.getAttribute('data-updatedtime'));

            extractedData.push({
                innerText: newsInnerText,
                href: "https://www.livemint.com" + newsHref,
                newsTime: newsUpdatedTime
            });

            for (const element of listToStoryElements) {
                const headlineSections = await element.$$('.headlineSec');

                for (const headlineSection of headlineSections) {
                    const headline = await headlineSection.$('.headline');
                    const linkElement = await headline.$('a');
                    const innerText = await headline.evaluate(el => el.innerText);
                    const href = await linkElement.evaluate(a => a.getAttribute('href'));

                    const timeParent = await headlineSection.$('span > span[data-updatedtime]');
                    const timeAttribute = await timeParent.evaluate(span => span.getAttribute('data-updatedtime'));

                    extractedData.push({
                        innerText: innerText,
                        href: "https://www.livemint.com" + href,
                        newsTime: timeAttribute
                    });
                }
            }

            // console.log('Extracted Data:', extractedData);
            // console.log('Total News:', extractedData.length);

            allNews.push(...extractedData)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            await browser.close();
        }
        resolve();
    });
}

async function saveToDB(newsArr) {
    try {
        const client = await mongoDBInstance.getClient();
        const database = client.db('test');
        const collection = database.collection('news');

        const newsSchema = new mongoose.Schema({
            innerText: String,
            href: String,
            newsTime: Date,
            tag: String
        });

        const News = mongoose.model('news', newsSchema);

        for (const element of newsArr) {
            try {
                const existingNews = await collection.findOne({ innerText: element.innerText });

                if (!existingNews) {
                    const newsItem = new News({
                        innerText: element.innerText,
                        href: element.href,
                        newsTime: element.newsTime,
                        tag: element.tag
                    });

                    const data = await newsItem.save();
                    console.log('News article added successfully.');
                } else {
                    console.log('News article already exists. Skipping.');
                }

                // return { status: true, user: data };
            } catch (err) {
                console.error('An error occurred:', err);
                // return { status: false, error: err.message };
            }
        }
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

scrapeData('/').then(() => {
    scrapeData('/page-2').then(() => {
        scrapeData('/page-3').then(() => {
            // console.log('Extracted Data:', allNews);
            // console.log('Total News:', allNews.length);

            // Remove news posted before yesterday 9 AM
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(9, 0, 0, 0);

            const filteredData = allNews.filter(item => new Date(item.newsTime) > yesterday);

            // Add tag to news
            filteredData.forEach(news => {
                const matchingCompany = companies.find(company => news.innerText.includes(company));
                news.tag = matchingCompany ? matchingCompany : '';
            });

            console.log('Extracted Data:', filteredData);
            console.log('Total News:', filteredData.length);

            saveToDB(filteredData);
        })
    })
});
