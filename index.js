import express from 'express'
import cors from "cors"
const app = express()
import fetch from 'node-fetch';
import bodyparser from 'body-parser'
import dotenv from 'dotenv'


let dotenvConfig = dotenv.config()

let PORT = process.env.PORT || 6000

app.use(cors())

var cache = {  //this cache as an object will store the state
  hour:0,minutes:0,oldHour:0,oldMinute:0
};

app.post('/getrates', bodyparser.json(),function(req, res, next) {
    let body = req.body
    console.log(body)
    cache.oldHour = cache.hour  //will assign the old minutes and hours to oldHour, oldMinute keys
    cache.oldMinute = cache.minutes 
    cache.hour = body.hrs   //will assign the current time
    cache.minutes = body.mns


   var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: {
          "apikey" :  "bKTS3F3e7OWfxfKs0g6iOA6RXYSWDuEe"
        }
    };
  if (cache.rates) {  //if we have already the response then we'll not make an api call again we'll simply return the stored data
    res.send(cache);
  } else {
    fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=&base=USD", requestOptions)
    .then(response => response.json()) 
    .then(response => {
      cache.rates = response.rates;
      console.log(cache)
      res.send(cache);
    })
  }
});

// setInterval(function() {  //it will delete cache[rates] in every minute so that we get the updated response
//   delete cache.rates;
// }, 60 * 1000)

app.listen(PORT)