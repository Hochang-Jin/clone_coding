var axios = require('axios');
require('dotenv').config({path: './.env'});
// 네이버 Papago NMT API 예제
var express = require('express');
const { OpenAIApiAxiosParamCreator } = require('openai');
var app = express();
console.log(process.env.clientID);
var client_id = process.env.clientID;
var client_secret = process.env.clientSecret;


app.get('/', function(req,res){
  res.sendFile(__dirname + '/test.html')
})

app.get('/translate', function (req, res) {
  var query = req.query.query;

   var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
   var request = require('request');
   var options = {
       url: api_url,
       form: {'source':'ko', 'target':'en', 'text':query},
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

   request.post(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       console.log(JSON.parse(body).message.result.translatedText);
       res.status(200).json(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });


  });
 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
;
 });


