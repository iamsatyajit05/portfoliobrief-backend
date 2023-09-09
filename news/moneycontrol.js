// Senior Developer: ChatGPT
// Intern: Satyajit
require('dotenv').config();
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const companies = require('../companyList'); 

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

const News = mongoose.model('news', new mongoose.Schema({
  headline: String,
  link: String,
  datetime: String,
  imageUrl: String,
  tag: String, // Add tag field to the schema
}));

async function scrapeMoneyControlNews() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'https://www.moneycontrol.com/news/tags/companies.html';
  
  try {
    await page.goto(url);

    // Wait for the news list to load (you may need to adjust the selector or wait time)
    await page.waitForSelector('.clearfix', { timeout: 10000 });

    const newsData = await page.evaluate(() => {
      const newsList = Array.from(document.querySelectorAll('.clearfix'));

      return newsList.map((newsItem) => {
        const headlineElement = newsItem.querySelector('h2 a');
        const linkElement = newsItem.querySelector('h2 a');
        const datetimeElement = newsItem.querySelector('span');
        const imageElement = newsItem.querySelector('img');

        const headline = headlineElement ? headlineElement.innerText : null;
        const link = linkElement ? linkElement.href : null;
        const datetime = datetimeElement ? datetimeElement.innerText : null;
        const imageUrl = imageElement ? imageElement.getAttribute('data-src') : null;

        return { headline, link, datetime, imageUrl };
      });
    });

    const validNewsData = newsData.filter(item => item.headline && item.link && item.datetime && item.imageUrl);

    return validNewsData;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

async function saveMoneyControlNewsToDB(newsArr) {
  try {
    for (const element of newsArr) {
      try {
        const existingNews = await News.findOne({ headline: element.headline });

        if (!existingNews) {
          const matchingCompany = companies.find(company => element.headline.includes(company));
          element.tag = matchingCompany ? matchingCompany : '';

          const newsItem = new News(element);

          await newsItem.save();
          console.log('News article added successfully.');
        } else {
          console.log('News article already exists. Skipping.');
        }
      } catch (err) {
        console.error('An error occurred:', err);
      }
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

(async () => {
  try {
    const newsData = await scrapeMoneyControlNews();

    console.log('Extracted Data:', newsData);
    console.log('Total News:', newsData.length);

    saveMoneyControlNewsToDB(newsData);
  } catch (error) {
    console.error('Error:', error);
  }
})();