{{{
    "title"    : "Create Angular nodejs Chat application in 5 minutes",
    "tags"     : [ "nodejs", "development" ],
    "category" : "nodejs",
    "date"     : "7-22-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)
<br><br>
For the past few months I have been working on tools to help development of real time communication and building Angularjs tools, however, I never showed an actual implementation example.
In this blog post I will show you how to create a basic chat application based on these tools.

Here's what I got in my toolbox:

1. <b>Server</b> - for the server side I will be using https://github.com/eladelrom/roomsjs-client a realtime a nodejs module I created that let's you choose the transporter (socket.io, engine.io, or sockjs).
2. <b>Client</b> - for the front end I will be using Angularjs.
3. <b>Tools</b> - I will be using https://github.com/eladelrom/generator-nglue for generating scaffolding scripts and deployment.

The final results wil looks like this:

![chat final](https://raw.github.com/EladElrom/poet/ei-pages/effectiveidea/public/images/chat.png)

<h2>server side</h2>

Let's start from the nodejs server side.  <a href='https://github.com/eladelrom/roomsjs-client'>Roomsjs</a> let's you utilize different transporters and create a room as well as subscribe to certain data and interact with database or any 3rd party data source.  I will start with installing roomsjs and roomsjs-db.
In command line create the project and install the npm modules, use the commands below;
<br>
<br>
<pre class="prettyprint">
> cd ~/dev
> mkdir rooms && cd $_
> npm install roomsjs rooms.db mongoose express engine.io
</pre>
<br>
Than create a `server.js` script;<br>
<br>
<pre class="prettyprint">
> vim server.js
</pre>
<br>
For the node entry file, server.js, I will be using <a href='https://github.com/LearnBoost/engine.io'>engine.io</a> transporter.  Keep in mind that `roomsjs` allows you to connect to other transporters such as socket.io and sockjs.  Engine.io is the high level API so it preferred to use that API instead of Socket.io.
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
Notice that we set our services folder directory as 'services/', we set the database to be MongoDB and the transporter to be 'engine.io'.
Next, we want to create a service that roomsdb can use, so we can insert any messages into our Mongodb database and can insert as well as read these messages;
<br>
<pre class="prettyprint">
> mkdir services
> vim services/insertchatmessage.js
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
We also need a service that will return all the existing message, 'vim services/getchatmessages.js';
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
I choose to connect to the `Mongodb` database but I can easily change this and connect to mysql database or any 3rd party API such as Amazon Services (CloudSearch) or any other data source.

<h3>start server</h3>

Now we are ready to start the server.
<br><br>
<pre>
> node server.js
</pre>
<br>
Once you start the server you should see the following message in the terminal:
<br>
<br>
<pre class="prettyprint">
~/dev/rooms $ node server.js
adding service method: insertchatmessage
adding service method: getchatmessages
Listening on http://[your-local-machine]:8081
</pre>
Notice that `insertchatmessage` and `getchatmessages` was mapped automatically for us and the service is ready to be used.  We will be passing the information through engine.io, which is valuable since the best transporter will be used to pass the information such as long polling, Flash, WebScoket (based on whatever the client can handle).

<h2>Client side</h2>

For the front end I will be using Angularjs.  Angularjs has a strong architecture and will help us to scale and turn our modules into a larger scale app if we ever need to.

In order to create the project's scaffolding and initial projects scripts quickly I will be using <a href='https://github.com/eladelrom/generator-nglue'>generator-nglue</a>. Nglue was built to help you scale your project so let's say the chat room we are building is just a part of a larger application, we will be able to glue these modules together to form one app and have the modules communicate with each other.
To create the project we will create the directory and start the `nglue` generator, see below;
<br>
<br>
<pre class="prettyprint">
> cd ~/dev
> mkdir chatRoom && cd $_
> yo nglue
> What's your project's name?: chatRoom
</pre>
<br>
<h3>install bower dependencies</h3>

Now that the scaffolding and the project was created we can add the bower dependencies we need for our project;
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
Now we can write the actual angular module.  `Generator-nglue` can helps us create the scaffolding for the module
<br><br>
<pre class="prettyprint">
> yo nglue:module chat
> cd code_base/modules/chat/scripts
</pre>
inside of `code_base/modules/chat/scripts` we can find all the scripts we need to edit.  Let's start from `app.js`
<br>
<br>
<h3>app.js</h3>
<br>
In `app.js` we will define the module we will be using and than add `roomsGateway` as a module we can use. `roomsGateway` as the name suggest will be our gateway to access roomsjs via the transporter we choose (engine.io);
Notice that we don't hard code the socket url but we will define it within the app, so we can easily replace it when going to production;
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
Right before the body tag in the index file, we will define the global variables, that will point to the server we will be using;
<br>
<br>
<pre class="prettyprint">
&#60;script&#62;
  // declare global variable
  var socketURL = 'ws://localhost:8081/',
    isDebugModeState = false;
&#60;/script&#62;
</pre>
<br>
<h3>chatModule partial</h3>

We also need the html partial that holds our simple minimalistic view of our application;
<br>
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
<h2>css</h2>

Edit the css file that nglue created for us with some basic css;
<br>
<pre>
> vim assets/styles/chatModule.css
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

We are ready to run grunt, which will do all the operation needed to complete the work by concatenate, minify and build all the dependencies we created;
<br>
<pre class="prettyprint">
> grunt
</pre>
<br>


