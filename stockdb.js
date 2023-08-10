
const { MongoClient } = require('mongodb');

const mongoose = require('mongoose'); // Import mongoose correctly
const mongoDB = require('./mongodb');
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose
const MONGODB_URI = process.env.MONGODB_URI;

//mongoDB().catch(err => console.error({ error: "ERROR" })); // Use console.error instead of resizeBy.json
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

const stocklistSchema = new Schema({
    selectedStocks: [String]
});

const Stocks = model('stocklist', stocklistSchema); 

async function stockSaveToDB(stocksList) {
    try {
        const newStockList = new Stocks({
            selectedStocks: stocksList,
        });

        const data = await Stocks.create(newStockList);

        return { status: true, user: data };
    } catch (err) {
        console.error('An error occurred:', err);
        return { status: false, error: err.message };
    }
}

module.exports = stockSaveToDB;
