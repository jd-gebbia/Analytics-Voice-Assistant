/*
Must install Node CLI and Firebase CLI
*/

//Heroku url ** https://git.heroku.com/analytics-voice-assistant.git


'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
//requiring module dependencies

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
//create server and define parsing srategies
function processV1Request (request, response) {
    let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
    let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  
    const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests
    const app = new DialogflowApp({request: request, response: response});
  
    // Create handlers for Dialogflow actions as well as a 'default' handler
    const actionHandlers = {
      // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
      'input.welcome': () => {
        // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
        if (requestSource === googleAssistantRequest) {
          sendGoogleResponse('Hello, from webhook'); // Send simple response to user
        } else {
          sendResponse('Hello, from webhook'); // Send simple response to user
        }
      },
      // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
      'input.unknown': () => {
        // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
        if (requestSource === googleAssistantRequest) {
          sendGoogleResponse('I\'m having trouble, can you try that again? *webhook'); // Send simple response to user
        } else {
          sendResponse('I\'m having trouble, can you try that again? *webhook'); // Send simple response to user
        }
      },
      'input.test_fulfillment': () => {
        // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
        let responseToUser = {
            speech: 'this is a test',
            displayText: 'Test has been completed if you see this',
            source:  'analytics-vocie-assistant'
        }
      },
      // Default handler for unknown or undefined actions
      'default': () => {
        // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
        if (requestSource === googleAssistantRequest) {
          let responseToUser = {
            //googleRichResponse: googleRichResponse, // Optional, uncomment to enable
            //googleOutputContexts: ['weather', 2, { ['city']: 'rome' }], // Optional, uncomment to enable
            speech: 'This is the default webhook response', // spoken response
            text: 'This is the default webhook response' // displayed response
          };
          sendGoogleResponse(responseToUser);
        } else {
          let responseToUser = {
            //data: richResponsesV1, // Optional, uncomment to enable
            //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
            speech: 'This is the default webhook response', // spoken response
            text: 'This is the default webhook response' // displayed response
          };
          sendResponse(responseToUser);
        }
      }
    };
  
    // If undefined or unknown action use the default handler
    if (!actionHandlers[action]) {
      action = 'default';
    }
  
    // Run the proper handler function to handle the request from Dialogflow
    actionHandlers[action]();

    function sendResponse (responseToUser) {
        // if the response is a string send it as a response to the user
        if (typeof responseToUser === 'string') {
          let responseJson = {};
          responseJson.speech = responseToUser; // spoken response
          responseJson.displayText = responseToUser; // displayed response
          response.json(responseJson); // Send response to Dialogflow
        } else {
          // If the response to the user includes rich responses or contexts send them to Dialogflow
          let responseJson = {};
          // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
          responseJson.speech = responseToUser.speech || responseToUser.displayText;
          responseJson.displayText = responseToUser.displayText || responseToUser.speech;
          // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
          responseJson.data = responseToUser.data;
          // Optional: add contexts (https://dialogflow.com/docs/contexts)
          responseJson.contextOut = responseToUser.outputContexts;
    
          console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
          response.json(responseJson); // Send response to Dialogflow
        }
      }
    }

// server.post('/make-request', function (req, res) {
//     return res.json({
//         speech: 'this is a test',
//         displayText: 'Test has been completed if you see this',
//         source:  'analytics-vocie-assistant'
//     });
// });
// server.post('/input.test-fulfillment', function (req, res) {
//     return res.json({
//         speech: 'tested that fulfillment',
//         displayText: 'Received fulfillment test in webhook',
//         source: 'analytics-voice-assistant'
//     });
// });
//define a route on the server.js


server.listen((process.env.PORT || 8000), function () {
    console.log("Server is running...");
});
/*server running and listening to requests.js*/
