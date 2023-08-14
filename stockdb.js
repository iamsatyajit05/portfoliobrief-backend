const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

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


const stocklistSchema = new mongoose.Schema({
    selectedStocks: [String],
    userEmail: String,
});

const Stocks = mongoose.model('stocklist', stocklistSchema);

async function stockSaveToDB(stocksList, email) {
    try {
        const newStockList = new Stocks({
            selectedStocks: stocksList,
            userEmail: email,
        });

        const data = await newStockList.save();

        return { status: true, user: data };
    } catch (err) {
        console.error('An error occurred:', err);
        return { status: false, error: err.message };
    }
}

module.exports = stockSaveToDB;
