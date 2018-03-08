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
    
        let resuest_info = req.body.result && req.body.result.parameters &&
         req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
        let reqUrl = encodeURI('http://theapache64.xyz:8080/movie_db/search?keyword=' + request_info);
        http.get(reqUrl, (responseFromAPI) => {
    
            responseFromAPI.on('data', function (chunk) {
                let movie = JSON.parse(chunk)['data'];
                let dataToSend = movieToSearch === 'The Godfather' ? 'I don\'t have the required info on that. Here\'s some info on \'The Godfather\' instead.\n' : '';
                dataToSend += movie.name + ' is a ' + movie.stars + ' starer ' + movie.genre + ' movie, released in ' + movie.year + '. It was directed by ' + movie.director;
    
                return res.json({
                    speech: dataToSend,
                    displayText: dataToSend,
                    source: 'make-request'
                });
            });
        }, (error) => {
            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'make-request'
            });
        });
    });
//define a route on the server.js

server.listen((process.env.PORT || 8000), function () {
    console.log("Server is running...");
});
//server running and listening to requests.js
