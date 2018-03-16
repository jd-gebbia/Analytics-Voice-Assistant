const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const firebase = require('firebase');

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
    else if(action=="get_Address"){
      var name = req.body.result.parameters.name;
      var ref = firebase.app().database().ref();
      global.address = "*couldn't get an address";

      ref.once('value').then(function(snap){
        global.address = snap.child(name).child('Address').val();
      });

      return res.json({
        speech: req.body.result.action,
        displayText: "this is the get_Address action",
        source: '/',
        messages: [
          {
            type: 0,
            speech: name+"'s address is "+global.address
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
            speech: "Sorry I don't know that action"
          }
        ]
      });
    }

  });

  var ref=firebase.app().database().ref();
  ref.once('value').then(function(snap){
    console.log('snap.val()',snap.val());
  });

  ref.once('value').then(function(snap){
    console.log("Address:", snap.child("Alan Turing").child('Address').val());
  });

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});