/*
Must install Node CLI and Firebase CLI
*/

//Heroku url ** https://git.heroku.com/analytics-voice-assistant.git


'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
//requiring module dependencies

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  if (request.body.result) {
    processV1Request(request, response);
  } else if (request.body.queryResult) {
    processV2Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
//create server and define parsing srategies

function processV2Request (request, response) {
    // An action is a string used to identify what needs to be done in fulfillment
    let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
    // Parameters are any entities that Dialogflow has extracted from the request.
    let parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
    // Contexts are objects used to track and store conversation state
    let inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
    // Get the request source (Google Assistant, Slack, API, etc)
    let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined;
    // Get the session ID to differentiate calls from different users
    let session = (request.body.session) ? request.body.session : undefined;
  
    // Create handlers for Dialogflow actions as well as a 'default' handler
    const actionHandlers = {
      // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
      'input.welcome': () => {
        sendResponse('Hello, Welcome to AVA!'); // Send simple response to user
      },
      // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
      'input.unknown': () => {
        // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
        sendResponse('I\'m having trouble, can you try that again? **webhook response**'); // Send simple response to user
      },

      'input.test_fulfillment' : () => {
        let responseToUser = { 
          //data: richResponsesV1, // Optional, uncomment to enable
          //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enablee
          
          speech: 'Successfully received fulfillment response to://', // displayed response
          displayText: 'Successfully received fulfillment response to://', // displayed response
          data:{
            google:{
                expect_user_response: false,
                final_response: {
                    speech_response: {
                    text_to_speech: "received webhook response"
                    }
                }
            }
        },
        contextOut:[],
        source:"webhook"
        };
        sendResponse(responseToUser);
    },
      // Default handler for unknown or undefined actions
      'default': () => {
        let responseToUser = {
          //fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
          //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
          speech: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)', // displayed response
          displayText: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        sendResponse(responseToUser);
      }
    };
  
    // If undefined or unknown action use the default handler
    if (!actionHandlers[action]) {
      action = 'default';
    }
  
    // Run the proper handler function to handle the request from Dialogflow
    actionHandlers[action]();
  
    // Function to send correctly formatted responses to Dialogflow which are then sent to the user
    function sendResponse (responseToUser) {
      // if the response is a string send it as a response to the user
      if (typeof responseToUser === 'string') {
        let responseJson = {fulfillmentText: responseToUser}; // displayed response
        response.json(responseJson); // Send response to Dialogflow
      } else {
        // If the response to the user includes rich responses or contexts send them to Dialogflow
        let responseJson = {};
  
        // Define the text response
        responseJson.fulfillmentText = responseToUser.fulfillmentText;
        // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
        if (responseToUser.fulfillmentMessages) {
          responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
        }
        // Optional: add contexts (https://dialogflow.com/docs/contexts)
        if (responseToUser.outputContexts) {
          responseJson.outputContexts = responseToUser.outputContexts;
        }
  
        // Send the response to Dialogflow
        console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
        response.json(responseJson);
      }
    }
  }

// server.post('/make-request', function (req, res) {
//     return res.json({
//         speech: 'this is a test',
//         displayText: 'Test has been completed if you see this',
//         source:  '/make-request'
//     });
// });
// server.post('/test-fulfillment', function (req, res) {
//     return res.json({
//         speech: 'tested that fulfillment',
//         displayText: 'Received fulfillment test in webhook',
//         source: '/analytics-voice-assistant'
//     });
// });
// //define a route on the server.js


server.listen((process.env.PORT || 8000), function () {
    console.log("Server is running...");
});
//server running and listening to requests.js
