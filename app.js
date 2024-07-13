const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')

const db = require('./database/database');

const app = express();

app.use(express.json())
app.use(cors())
dotenv.config()

app.get('/', (req, res) => {
    res.json({"response": "api working"})
})



const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});