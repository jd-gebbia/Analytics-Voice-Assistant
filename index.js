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
    else if(action=="echo"){
      return res.json({
        speech: req.body.result.action,
        displayText: "this is the echo action",
        source: '/',
        messages: [
          {
            type: 0,
            speech: "You sent "+req.body.result.resolvedQuery+" from "+req.body.result.source
          }
        ]
      });
    }
    else{
      return res.json({
        speech: req.body.result.action,
        displayText: "Unknown Action",
        source: '/',
        messages: [
          {
            type: 0,
            speech: "Im sorry I cant quite tell what you mean for me to do"
          }
        ]
      });
    }

  });

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});