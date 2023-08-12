// Senior Developer: ChatGPT
// Intern: Satyajit
const puppeteer = require("puppeteer");

async function scrapeData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.livemint.com/companies`, { waitUntil: 'networkidle2' });

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
            href: "https://www.livemint.com"+newsHref,
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
                    href: "https://www.livemint.com"+href,
                    newsTime: timeAttribute
                });
            }
        }

        console.log('Extracted Data:', extractedData);
        console.log('Total News:', extractedData.length);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

scrapeData();