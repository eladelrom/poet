{{{
    "title"    : "Create Angular nodejs Chat application in less than 2 minutes",
    "tags"     : [ "nodejs", "development" ],
    "category" : "nodejs",
    "date"     : "7-22-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

For the past few months I have been working on tools to help development of real time communication and building Angularjs tools, however, I never showed an actual implementation example.

Here's what I got in my toolbox:

1. <b>Server</b> - for the server side I will be using roomsjs a realtime a nodejs module I created that let's you choose the transporter (socket.io, engine.io, sockjs).
2. <b>Client</b> - for the front end I will be using Angularjs.
3. <b>Tools</b> - I will be using nglue for generating scaffolding scripts and deployment.

The final results looks like this:

![chat final](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/chat.png)

## server side

Let's start from the nodejs server side.  Roomsjs let's you utilize different transporters and create a room as well as subscribe to certain data and interact with database or any 3rd party data source.  I will start with installing roomsjs and roomsjs-db;
<br>
<pre class="prettyprint">
cd ~/dev
mkdir rooms && cd $_
npm install roomsjs rooms.db mongoose express engine.io
</pre>
<br>
Than create a `server.js` script;<br>
<br>
<pre class="prettyprint">
> vim server.js
</pre>
<br>
For the node server.js file I am going to use the engine.io transporter.  Keep in mind that roomsjs allows you to connect to other transporters such as socket.io and sockjs.
<br>
<br>
<pre class="prettyprint">
'use strict';

var os = require('os'),
  rooms = require('roomsjs'),
  roomdb = require('rooms.db'),
  port = (process.env.PORT || 8081);

// create express server if needed
var express = require('express'),
  app = express().use(express.static(__dirname + '/client'));

// engine.io
var server = require('http').createServer(app).listen(port, function () {
  console.log('Listening on http://' + os.hostname() + ':' + port);
});

// services
roomdb.setServices('services/');
roomdb.connectToDatabase('mongodb', 'mongodb://localhost/test', {});

// set rooms
rooms = new rooms({
  isdebug : true,
  transporter : {
    type: 'engine.io',
    server : server
  },
  roomdb : roomdb
});
</pre>

<br>
Next, we want to create a service that roomsdb can use, so we can insert any messages into our Mongodb database;
<br>
<pre class="prettyprint">
mkdir services
vim services/insertchatmessage.js
</pre>
<br>
The code below, will create the service we need and once it's called it will create the schema, data model and insert the data into the database;
<br>
<br>
<pre class="prettyprint">
'use strict';

function insertchatmessage(data, dbconnectorCallBackToRooms) {
  var connector = this.getConnector(),
    Chat;

  if (connector.isModelExists('Chat')) {
    Chat = connector.getModel('Chat');
  } else {
    var schema = connector.setSchema({
      chatMessage: 'string',
      roomId: 'Number',
      gravatar: 'string',
      email: 'string',
      userName: 'string'
    });
    Chat = connector.setModel('Chat', schema);
  }

  var chatMessage = new Chat({
    chatMessage: data.params.chatMessage,
    roomId: data.params.roomId,
    gravatar: data.params.gravatar,
    email: data.params.email,
    userName: data.params.userName
  });

  chatMessage.save(function (err) {
    if (err) {
      console.log('error' + err.message);
    } else {
      Chat.find(function (err, messages) {
        if (err) {
          console.log('error getting messages: ' + err.message);
        }
        dbconnectorCallBackToRooms(data, messages);
      });
    }
  });
}

module.exports.insertchatmessage = insertchatmessage;
</pre>
<br>

We also need a service that will return all the existing message, getchatmessages.js;
<br><br>
<pre class="prettyprint">
function getchatmessages(data, dbconnectorCallBackToRooms) {
  var connector = this.getConnector(),
    Chat;

  if (connector.isModelExists('Chat')) {
    Chat = connector.getModel('Chat');
  } else {
    var schema = connector.setSchema({
      chatMessage: 'string',
      roomId: 'Number',
      gravatar: 'string',
      email: 'string',
      userName: 'string'
    });
    Chat = connector.setModel('Chat', schema);
  }

  Chat.find(function (err, messages) {
    if (err) {
      console.log('error getting messages: ' + err.message);
    }

    var messagesCollection = [];

    for (var i=0; i < messages.length; i++) {
      messagesCollection.push({
        chatMessage: messages[i]._doc.chatMessage,
        roomId: messages[i]._doc.roomId,
        gravatar: messages[i]._doc.gravatar,
        email: messages[i]._doc.email,
        userName: messages[i]._doc.userName
      });
    }
    dbconnectorCallBackToRooms(data, messagesCollection);
  });
}

module.exports.getchatmessages = getchatmessages;
</pre>
<br>
I choose to connect to Mongodb database but I can easily change this and connect to mysql database or any 3rd party API such as Amazon Services (CloudSearch) or any other data source.

<h3>start server</h3>

Now we can start the server.

> node server.js

You should see the following:
<br>
<br>
<pre class="prettyprint">
~/dev/rooms $ node server.js
adding service method: insertchatmessage
Listening on http://Elads-MacBook-Pro-3.local:8081
</pre>
Notice that `insertchatmessage` was mapped automatically for us.

## Client side

For the front end I will be using Angularjs.  In order to create the project's scaffolding and initial projects scripts I will be using generator-nglue. Nglue is built to help you scale your project so let's say the chat room we are building is just a part of a larger application, we will be able to glue these modules together to form one app and have the modules communicate with each other.
To create the project we will create the directory and start the nglue generator, see below;
<br>
<br>
<pre class="prettyprint">
cd ~/dev
mkdir chatRoom && cd $_
yo nglue
What's your project's name?: chatRoom
</pre>
<br>
<h3>install bower dependencies</h3>

Now that the scaffolding and project was created we can add the bower dependencies we need for our project;
<br>
We want to added the `roomsjs-client` dependency;
<br><br>
<pre class="prettyprint">
> bower install roomsjs-client --save
</pre>
<br>
Next, we want to add libraries dependencies for the project,

Open the nglue file;
<br><br>
<pre class="prettyprint">
> vim code_base/assets/nglue.json
</pre>
Than add the dependencies to the dependencies json tag;
<br><br>
<pre class="prettyprint">
  "dependencies": {
    "angular": "bower_components/angular/angular.js",
    "engine-io": "bower_components/roomsjs-client/client/examples/engineio/libs/engine.io.js",
    "roomsjs-client": "bower_components/roomsjs-client/client/dist/libs/rooms.js",
    "rooms": "bower_components/roomsjs-client/client/examples/angular/angular-rooms.js"
  }
</pre>
<br>
Now we can write the actual angular module.  Generator-nglue helps us creating the scaffolding for the module
<br><br>
<pre class="prettyprint">
> yo nglue:module chat
> cd code_base/modules/chat/scripts
</pre>
inside of `code_base/modules/chat/scripts` we can find all the scripts we need to edit.  Let's start from app.js
<br>
<h3>app.js</h3>
<br>
In app.js we will define the module we will be using and than add `roomsGateway` as a module. `roomsGateway` as the name suggest will be our gateway to access roomsjs via the transporter we choose (engine.io);
Notice that we don't hard code the socket url but we will define it whitin the app, so we can easily replace it when going to production;
<br>
<br>
<pre class="prettyprint">
angular.module('chatModule', ['rooms'])
  .run(['roomsGateway', function (roomsGateway) {
    roomsGateway.connectToGateway(window.socketURL, window.isDebugModeState);
  }]);
</pre>
<br>
<h3>Controller</h3>

The Angular controller will holds the logic to handle the user gestures when the user needs to submit a message or retrieve messages.
First we will open up the file;
<br><br>
<pre class="prettyprint">
> vim controllers/chatModule.js
</pre>
<br>
Than paste the following code;
<br><br>
<pre class="prettyprint">
angular.module('chatModule')
  .controller('ChatModuleController', ['$scope', 'roomsGateway', function ($scope, roomsGateway) {
    roomsGateway.connectToGateway(window.socketURL, window.isDebugModeState);

    $scope.messages = [];

    var roomsCallbackName = roomsGateway.registerCallBack(function (data) {
        $scope.$apply( function () {
          // show history
          $scope.messages = data.vo;
        });
      });

    var onInsertComplete = roomsGateway.registerCallBack(function (data) {
        console.log('insert: ' + data);
        roomsGateway.serviceCall('getchatmessages', roomsCallbackName, {roomId: 1});
      });

    $scope.publish = function () {
      roomsGateway.serviceCall('insertchatmessage', onInsertComplete, {
        userName: $scope.message.userName,
        chatMessage: $scope.message.chatMessage,
        chatUserId: '1',
        email: $scope.message.email,
        roomId: '1'
      });
    }

    roomsGateway.serviceCall('getchatmessages', roomsCallbackName, {roomId: 1});

  }]);
</pre>
<br>
<h3>index.html</h3>

Right before the body tag, we will define the global variables, that will point to the server we will be using;
<br>
<br>
<pre class="prettyprint">
  // declare global variable
  var socketURL = 'ws://localhost:8081/',
    isDebugModeState = false;
</pre>

<h3>chatModule partial</h3>

We also need the html partial;

<br>
<pre class="prettyprint">
vim assets/views/chatModule.html
</pre>
<br>

<pre>
&#60;div ng-controller="ChatModuleController"&#62;
    &#60;div class="well"&#62;
      &#60;form class="form-horizontal"&#62;
        &#60;label&#62;Name:&#60;/label&#62; &#60;input placeholder="Your Name" type="text" name="username" ng-model="message.userName"/&#62; &#60;br/&#62;
        &#60;label&#62;Email:&#60;/label&#62; &#60;input placeholder="Your Email" type="text" name="email" ng-model="message.email"/&#62; &#60;br/&#62;
        &#60;label&#62;Message:&#60;/label&#62; &#60;input placeholder="type your message here" type="text" name="text" ng-model="message.chatMessage"/&#62;
        &#60;button type="submit" ng-click="publish()" class="btn btn-primary"&#62;Submit&#60;/button&#62;
      &#60;/form&#62;
      &#60;hr/&#62;

      &#60;!-- Message List --&#62;
      &#60;div id="messages" class="table-striped"&#62;
        &#60;div class="message" ng-repeat="message in messages" cool-fade&#62;
          &#60;div class="avatar-frame"&#62;
            &#60;img ng-src="{{message.gravatar}}" class="avatar avatar-60 photo" height="60" width="60"/&#62;
          &#60;/div&#62;
          &#60;p class="user"&#62;{{message.userName}} said:&#60;/p&#62;
          &#60;p class="text"&#62;{{message.chatMessage}}&#60;/p&#62;
        &#60;/div&#62;
      &#60;/div&#62;
&#60;/div&#62;
</pre>

<br>
## css

Edit the css file
<br>
<pre>
vim assets/styles/chatModule.css
</pre>
<br>
<pre class="prettyprint">
&#35;messages div.message {
    border-bottom: solid #fff 1px;
    padding: 0.7em;
    height: 58px;

}
&#35;messages div.message p {
    margin: 0.2em;
    padding: 0;
    color: #333;
}
&#35;messages div.message p.user {
    font-weight: bold;
}
</pre>
<br>
<h3>Run</h3>

Running grunt will concatenate, minify and build all the dependencies we created;
<br>
<pre class="prettyprint">
> grunt
</pre>
<br>


