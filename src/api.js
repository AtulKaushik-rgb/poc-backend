const express = require('express');
var cors = require('cors');
const serverless = require('serverless-http');

const dbData = require('../db')

const app = express();
app.use(cors());
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
    res.send(dbData);
  });

router.get("/items/search", async function (req, res, next) {
    let data = null;
    try {
      const response = dbData;
      const output = response;
  
      console.log(response);
      if (req.query.q !== "all")
        data = output.filter(
          (items) => items.title.toLowerCase() === req.query.q.toLowerCase()
        );
      else data = output;
  
      if (req.query.max) {
        data = data.filter(
          (items) => parseInt(items.prices) <= parseInt(req.query.max)
        );
  
        if (req.query.brands && req.query.brands.length != 5) {
          var numberArray = JSON.parse(req.query.brands).map(function (item) {
            return parseInt(item);
          });
  
          if (numberArray.length != 5)
            data = data.filter((items) =>
              numberArray.includes(parseInt(items.brand))
            );
        }
  
        if (req.query.star != 1)
          data = data.filter(
            (items) => parseInt(items.customer_rating) >= parseInt(req.query.star)
          );
      }
    } catch (error) {
      console.log("error happened");
      res.send("inside catch");
    }
    if (!data) res.status(404).send("error");
  
    res.send(data);
  });


app.use('/.netlify/functions/api',router);

module.exports.handler = serverless(app);