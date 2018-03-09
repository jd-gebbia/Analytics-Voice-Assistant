const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const firebase=require('firebase');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

firebase.initializeApp({
  "serviceAccount": "./service-account.json",
  "databaseURL": "https://my-weather-23327.firebaseio.com/",
});

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
    /*else if(action=="GetField"){
      //let field=req.body.
    }*/
    else if(action=="GetTableData"){
      var table = req.body.result.parameters;
      var data = snap.val();
      return res.json({
        speech: "this is the table",
        displayText: "Get Table Data",
        source: '/',
        messages: [
          {
            type: 0,
            speech: data.JD
          }
        ]
      });
    }
    else{
      return res.json({
        speech: req.body.result.action,
        displayText: "default action",
        source: '/',
        messages: [
          {
            type: 0,
            speech: "default"
          }
        ]
      });
    }

  });

  var ref=firebase.app().database().ref();
  ref.once('value').then(function(snap){
    console.log('snap.val()',snap.val());
  });

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});