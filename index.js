require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

//const { stockSaveToDB, updateStocks,fetchedNews } = require('./stockdb');
//const {fetchedNews} = require('./fetchedNews');
const {fetchedNews} = require('./stockdb');
const {userNews} = require('./sendResNews');
// dedicated to web3 world
app.get('/gm', (req, res) => {
    res.send('GM!');
});

app.post('/api/addstocks', async (req, res) => {
const { stocks , userEmail } = req.body;

    try {
        const result = await stockSaveToDB(stocks, userEmail );

        if (result.status) {
            res.status(200).json({ message: 'Function executed and data saved', user: result.user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/updatestocks',async(req,res)=>{
    const {email}=req.body;
    console.log(req.body);
    console.log("Email from parent:", email);
    
    try{ 
        const listedStocks = await updateStocks(email);

        if (listedStocks) {
            console.log("Stocks in parent", listedStocks);
            res.status(200).json({ status: true, message: 'Stocks listed successfully', stocks: listedStocks[0].selectedStocks });
        } 
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/usernews',async(req,res)=>{
    const {email}=req.body;
    console.log(req.body);
    console.log("Email from parent:", email);
    
    try{ 
        const news = await userNews(email);
        console.log(news);
        if (news) {
            console.log("News in parent", news);
            res.status(200).json({ status: true, message: 'Stocks listed successfully', news: news });
        } 
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

console.log(1);
app.post('/api/fetchnews', async (req, res) =>{
    console.log("2");
    try {
        // Assuming you have a function named fetchedNews that fetches news data
        const fetchedNewsData = await fetchedNews(); // Renamed variable to avoid confusion
        console.log(3);
        //console.log("fetchednews", fetchedNewsData);
        
        if (fetchedNewsData) {
            console.log("News in parent");
            res.status(200).json({ status: true, message: 'News listed successfully', news: fetchedNewsData });
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});