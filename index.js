const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/', function (req, res) {

    let action = req.body.result && req.body.result.action ? req.body.result.action: "default";
    if(action=="default"){
      return res.json({
        speech: req.body.result.action,
        displayText: "This is the default action",
        source: '/'
      });
    }
    else{
      return res.json({
        speech: req.body.result.action,
        displayText: "this is not the default action",
        source: 'get-movie-details',
        /*messages: [
          {
            type: 1,
            speech: "This worked correctly"
          }
        ]*/
      });
    }

  });

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});