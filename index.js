const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const schema = require('./schema/schema');
const {graphqlHTTP} = require('express-graphql');
const colors = require('colors');
const connectDB = require('./config/db');

const app = express() 

//connect database
connectDB();

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))


app.get('/',(req,res) => {
    res.send("we are live ")
})
 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});