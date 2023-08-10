require('dotenv').config();

const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

const stockSaveToDB = require('./stockdb');

// dedicated to web3 world
app.get('/gm', (req, res) => {
    res.send('GM!');
});

app.post('/api/addstocks', async (req, res) => {
  const { stocks } = req.body;

  try {
      await stockSaveToDB(stocks);
      res.status(200).json({ message: 'Function executed and data saved' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});