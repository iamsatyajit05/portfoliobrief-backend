require('dotenv').config();

const express = require('express');
const app = express();
const port = 5000;

// dedicated to web3 world
app.get('/gm', (req, res) => {
    res.send('GM!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
