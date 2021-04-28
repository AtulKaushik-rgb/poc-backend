const express = require('express')
const serverless = require('serverless-http');

const data = require('../db')

const app = express();
const router = express.Router();

router.get('/',(req,res)=>{
    res.json({
        "Hello":"api data"
    })
})

router.get('/test',(req,res)=>{
    res.json({
        'hello':'test'
    })
})

router.get("/items", async function (req, res, next) {
    res.send(data);
  });


app.use('/.netlify/functions/api',router);

module.exports.handler = serverless(app);