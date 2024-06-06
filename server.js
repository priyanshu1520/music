const express=require('express');
const app = express();
const db=require('./db');
const userroute=require('./routes/userRoutes.js');
const artistroute=require('./routes/artistRoutes.js');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
const PORT=process.env.PORT||3000;
app.use('/user',userroute)
app.use('/song',artistroute)
app.listen(3000,()=>{
    console.log('connected to server 3000');
});