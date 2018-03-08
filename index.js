/*
Must install Node CLI and Firebase CLI
*/

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
//requiring module dependencies

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
//create server and define arsing srategies

server.post('/make-request', function (req, res) {
    return res.json({
        speech: 'this is a test',
        displayText: 'Test has been completed if you see this',
        source: '/make-request'
    });
});
//define a route on the server.js

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is running...");
});
//server running and listening to requests.js
