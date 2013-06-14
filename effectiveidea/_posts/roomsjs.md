{{{
    "title"    : "roomsjs + rooms.db = easy front-end implementation",
    "tags"     : [ "nodejs", "roomsjs", "socketio", "javascript" ],
    "category" : "nodejs",
    "date"     : "6-01-2013"
}}}

Author: [Elad Elrom](https://twitter.com/EladElrom)

Seamless Real Time Communication
================================

Light-weight backend/front-end libraries built on top of socketio to help creating rooms and streaming data between users, streaming data from a database and even 3rd party services.

As mentioned on the [previous blog post](http://effectiveidea.com/_posts/firstpost), the idea of `roomsjs` was be able to be flexible to not only allow you to use your current technology stack to integrate features so instead so you can easily use your existing rooms.db (`mysql`, `mssql`, `mangodb`, or even 3rd party service to serve as your `dbconnector`) as well as whatever front-end you like.

Here are some of the feature list, real time communication and collaboration platform:

    1. Connect to a room
    2. Register a user
    2. Request number of users
    3. Private message
    4. Video
    5. Create multiple rooms
    6. Store states.
    7. Subscribe to data VO.
    8. Flash (AMS) Webcam fallback
    9. HTML5 Webcam
    10. Database connector (mysql)
<br><br>
Below is a ten thousand foot diagram that shows how the different pieces of the platform are coming together.
<br><br>
![roomjs diagram](https://raw.github.com/EladElrom/poet/master/public/images/roomsjs-diagram1.png)
<br><br>
*Diagram 1: 10 thousand foot diagram*

Demo
----
Demo is on this actual blog :), you can see on the right corner the number of visitors on this page, since each page got registered and subscribed to messages and you can go on your webcam and talk to any person in this room.  Open the developer console to see the debugging messages (they are turned on).

![console results](https://raw.github.com/EladElrom/poet/master/public/images/console-roomsjs.png)
<br><br>
*Diagram 2: showing console results from chrome*

Download / Fork
===============
[github roomjs](https://github.com/EladElrom/RoomsJS)

You can install using npm:

> npm install roomsjs

See rooms.db connector companion module:

> npm install rooms.db

roomjs
======

![backend diagram](https://raw.github.com/EladElrom/poet/master/public/images/roomsjs-diagram2.png)
<br><br>
*Diagram 3: backend*

In the backend we are passing the web server instance, `socketio` instance, the `dbconnector` module so we can connect to a database and a flag to indicate if we are in debug mode or not, so we can turn on/off debugger messages.
Our first task is to assign these variables and set the class possible states.
<br><br>

<pre class="prettyprint">
function listenToRoomEvents(server,isdebug,socketio,dbconnector) {

if (socketio == null)
    socketio = require('socket.io');

_dbconnector = dbconnector;

var states = new Object();
basketutil.setConstant(states, 'STATE', 'state');
basketutil.setConstant(states, 'SUBSCRIPTIONS', 'subscriptions');
basketutil.setConstant(states, 'USERS', 'users');

basketutil.isdebugmode = isdebug;
</pre>

<br><br>
Notice that there three states that can be passed;

* `state` - will be used to store the room's state.
* `subscriptions` - will be used to store the user's subscriptions.
* `users` - will be used to store each room's users.

These states will be used as we build our object that hold the information about each room.
<br><br>
Our next task is to start listening to socketio messages, using the `socketio` listen method
<br><br>
<pre class="prettyprint">
io = socketio.listen(server,{log: false, transports:['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']});
</pre>
<br><br>
The `messagetype` serves as an enum class that stores all the different messages will be listening to and we will be using this class on the back-end and front-end to avoid typing the messages types.  The first message we want to listen to is the `messagetype.CONNECTION` message, since we want to know once people have connected to the room. Clients may connect to the room and register or just connect without registering.
<br><br>
<pre class="prettyprint">
io.sockets.on(messagetype.CONNECTION, function (socket)
</pre>
<br><br>
`messagetype.JOIN_ROOM` message will allow the client to set the data structure sceme for each client using the `setBasketObjectSceme`, which will include all the states types for that user, subscriptions to the room and other important information.
<br><br>
<pre class="prettyprint">
socket.on(messagetype.JOIN_ROOM, function (data) {

    socket.set('room', data.roomName, function() {
        basketutil.log('room:: ' + data.roomName + ' saved');
    });

    if ( ! data.hasOwnProperty(states.SUBSCRIPTIONS) )
        data[states.SUBSCRIPTIONS] = null;

    basketutil.setBasketObjectSceme(basket,data.roomName,data[states.SUBSCRIPTIONS],states);

    socket.join(data.room);
});
</pre>
<br><br>
`SUBSCRIPTIONS` message type allow users to subscribe to data in the room, this allow you to create a data objects set and have users subscribe to changes in these data sets.
<br><br>
<pre class="prettyprint">
socket.on(messagetype.SUBSCRIPTIONS, function (data) {
    var room = data.room;
    var data_name = data.name;
    var userId = data.userId;

    if ( ! basket[room][states.SUBSCRIPTIONS].hasOwnProperty(data_name) ) {
        basket[room][states.SUBSCRIPTIONS][data_name] = new Object();
    }

    if ( ! basket[room][states.SUBSCRIPTIONS][data_name].hasOwnProperty(userId) ) {
        basket[room][states.SUBSCRIPTIONS][data_name][userId] = true;
    }
});

</pre>
<br><br>
`REGISTER` message type is used when a user first register to a room and allow us to keep track of who register to what room.
<br><br>
<pre class="prettyprint">
socket.on(messagetype.REGISTER, function(data) {

    if (!basket[data.roomName][states.USERS].hasOwnProperty(data.userId))
        basket[data.roomName][states.USERS][data.userId] = socket.id;

    basketutil.log("User register:" + data.userId);

    if ( basket[data.roomName][states.SUBSCRIPTIONS].hasOwnProperty('RoomInfoVO') ) {
        var size = basketutil.size(basket[data.roomName][states.USERS]);
        var users = basket[data.roomName][states.USERS];
        for (var id in users) {

            var retData = new Object();
            retData.size = size;
            retData.register = data.userId;

            io.sockets.socket(users[id]).emit(messagetype.REQUEST_NUM_OF_USERS,retData);
            basketutil.log("send REQUEST_NUM_OF_USERS message to: " + id);
        }
    }
});

</pre>
<br><br>
`STORE_STATE` message is used to store a change in the front-end application state so we can let other clients know that there was a change as well as notifiy new users of the application state if needed.
<br><br>
<pre class="prettyprint">

socket.on(messagetype.STORE_STATE, function(data) {
    socket.get('room', function(err, room) {
        basketutil.log("store state: " + data.name + ' in room ' + room);
            if (!basket[room][states.STATE].hasOwnProperty(data.name)) {
                basket[room][states.STATE][data.name] = new Object();
                if ( !basket[room][states.STATE][data.name].hasOwnProperty(data.sessionId) ) {
                    basket[room][states.STATE][data.name] = new Object();
                }
                basket[room][states.STATE][data.name][data.userId] = data.vo;
            }

        if ( basket[room][states.SUBSCRIPTIONS].hasOwnProperty(data.name) ) {
            var size = basketutil.size(basket[room][states.SUBSCRIPTIONS][data.name]);
            var users = basket[room][states.USERS];
            var dataBack = new Object();
            dataBack.name = data.name;
            dataBack.vo = data.vo;
            for (var id in users) {
                if (id != data.userId) {
                    io.sockets.socket(users[id]).emit(messagetype.STATE_CHANGE, dataBack);
                }
            }
        }
    })
});

</pre>
<br><br>
`GET_STATE` is used to get the application's state by a client.
<br><br>
<pre class="prettyprint">

socket.on(messagetype.GET_STATE, function(data) {
    var size = basketutil.size(basket[data.room][states.STATE]);
    if (size > 0) {
        basketutil.log('state request for state: '+data.stateName+' from userId: ' + data.userId + ', in room: ' + data.room);
        var to = basket[data.room][data.userId];
        var object = new Object();
        object.name = data.stateName;
        object.vo = basket[data.room][states.STATE][data.stateName];
        io.sockets.socket(to).emit(messagetype.GET_STATE,object);
    } else {
        basketutil.log('No state in room: ' + data.room);
    }
});

</pre>
<br><br>
`REQUEST_NUM_OF_USERS` is a request from any client to know how many other clients are in that room.
<br><br>
<pre class="prettyprint">

socket.on(messagetype.REQUEST_NUM_OF_USERS, function(data) {
    var to = basket[data.room][states.USERS][data.userId];
    var size = basketutil.size(basket[data.room][states.USERS]);
    basketutil.log("send numberOfUsersInRoom to: " + data.userId + ':'+to+', in room: ' + data.room);

    var retData = new Object();
    retData.size = size;

    io.sockets.socket(to).emit(messagetype.REQUEST_NUM_OF_USERS,retData);
});

</pre>
<br><br>
`DBCONNECTOR` will be used by the `dbconnector` modular and allow the user to create service call to the database or any other 3rd party service, I will discuss below;
<br><br>
<pre class="prettyprint">

socket.on(messagetype.DBCONNECTOR, function(data) {
    basketutil.log("Client data: " + data.userId + ', calltype: ' + data.methodName);

    if (_dbconnector.hasOwnProperty(data.methodName)) {

        _dbconnector[data.methodName](data, function(data, vo) {
            basketutil.log('dbconnectorCallBack to user ' + data.userId);
            var retVal = new Object({data:data, vo: vo});
            var users = basket[data.room][states.USERS];
            io.sockets.socket(users[data.userId]).emit(messagetype.DBCONNECTOR, retVal);
        });

    } else {
        basketutil.log("method doesn't exists");
    }
});

</pre>
<br><br>
`DISCONNECT` will react on a disconnect of user/s from a room and will notify other users (if they subscribe to a change number of users notification messages).  It also serves as the garbage collector since it will clean and close rooms if there is no one there.
<br><br>
<pre class="prettyprint">
socket.on(messagetype.DISCONNECT, function(){
}
</pre>

rooms.db
========
![rooms.db diagram](https://raw.github.com/EladElrom/poet/master/public/images/roomsjs-diagram5.png)
<br><br>
*Diagram 4: rooms.db diagram*

Connecting to a database is important since you may want to store information or get data from the database.  Additionally, you can use some http service, but why not harness the power of `WebSocket` to pass the data quicker.  This can be used as it's own entity and you can create services for your application to only get data from the database, or as part of the application real time communication.  If you use this as it's own entity you can connect to a room and than disconnect once you receive the data.

### connector.js

<br><br>
<pre class="prettyprint">
var connector;

function connectToDatabase(dbType,host,user,password,isdebug) {
    isdebugmode = isdebug;
    log('connectdb:: host:'+host+', user:'+user+', password:'+password);

    switch (dbType) {
        case 'mysql':
            connector = require('./mysqlconnector.js');
            connector.connectdb(host,user,password);
            break;
        default:
            log(dbType+' database type not supported yet');
    }
}

function sqlCommand(sql,sqlCallback) {
    connector.runSQLCommand(sql,sqlCallback);
}
</pre>
<br><br>

### mysqlconnector.js

The idea is to allow adding as many connectors as you want so instead of marrying one database or another the platform is agnostic and you can even create a 3rd party as a connector.  I had a need to use this for an existing client that uses mysql database.  It seems that MangoDB is the nodejs's developers favourite database, however I was glad to create a solution that is more of a real life example.
The connector is calling another npm module (mysql) to do the heavy lifting so the code is minimal and you can easily create your own connector.

First, we pass the `connection` object, which will be passed from the main application.  Than we connect to the database, see below;
<br><br>
<pre class="prettyprint">
var connection;

function connectdb(host,user,password) {
    var mysql      = require('mysql');
    connection = mysql.createConnection({
        host     : host,
        user     : user,
        password : password,
    });

    connection.connect();
}
</pre>
<br><br>

We can than create a method to run a sql command `runSQLCommand` and that's it. We are ready to implement.

<pre class="prettyprint">
function runSQLCommand(sql,sqlCallback) {
    connection.query(sql, function(err, rows, fields) {
      if (err) throw err;
      sqlCallback(rows);
    });
}
</pre>
<br><br>
### roomsdb_sample

For the implementation the idea is to create a *hot* folder `roomsdb` that will hold the implementation for all the services call you need.  You can list all the different methods that the `dbconnector` will be using.  It will be mapping each method with it's respected file that will implement that method.  This way we get this nice seperation of concerns that allow you to have all the code for one service call at one place.

<br><br>
### dbconnector_methods.js
<br><br>

<pre class="prettyprint">
function setMethods(dbconnector) {

    // getItems method
    dbconnector.getItems = require('./service/getitems.js').getItems;

    // method #2 implement
    // method #3 implement

}
</pre>
<br><br>
### getitems.js

As you see above in `setMethods` function we set all the service call we would like to expose. `getitems.js` is just an example, and here we are making a select call from some databaes with some condition, we than create a value object (vo), however that step is not necessary, since we will be able to just pass the object as is. `mysql` module will return results as an array so there is no need to serialize the data at all and this can be done on the client's level side.
<br><br>
<pre class="prettyprint">
function getItems(data,dbconnectorCallBackToRooms) {

    var sqlString = "SELECT * FROM [database].[table] WHERE [some-condition] != '' LIMIT 1";

    this.sqlCommand(sqlString,
        function(rows) {
            var vo = new VO(rows[0].id, rows[0].name);
            dbconnectorCallBackToRooms(data,vo);
        }
    );
}

function VO(id, name) {
    this.id = id;
    this.name = name;
}
</pre>

And this is all that it takes.

Web server
==========

![rooms.db diagram](https://raw.github.com/EladElrom/poet/master/public/images/roomsjs-diagram2.png)
<br><br>
*Diagram 5: web server diagram*

To tie everything together we I am using the `express` web server.  The initial setting of `express` is using  `version 3.0.0rc5` but you can upgrade easily when new version is out.

Next, we setting the room and connector modules.  Notice that we are passing the `dbconnector` as an optional variable so you can communicate back to the front-end with the service call results.

<br><br>
<pre class="prettyprint">
var connect = require('connect'),
    express = require( 'express' ),
    app     = express(),
    os      = require('os'),
    http    = require('http'),
    server = http.createServer(app),
    port    = (process.env.PORT || 8081);

app.use(express.static(__dirname + '/public'));

server.listen(port, function() {
    console.log('Listening on http://'+os.hostname()+':' + port );
});

// dbconnector
var dbconnector = require('rooms.db');
dbconnector.connectToDatabase('mysql','localhost','root','');
require('./roomsdb_sample/dbconnector_methods.js').setMethods(dbconnector);

// rooms (socketio)
var rooms = require('rooms');
rooms.listenToRoomEvents(server,true,dbconnector);
</pre>

Front-end
=========

![rooms.db diagram](https://raw.github.com/EladElrom/poet/master/public/images/roomsjs-diagram3.png)
<br><br>
*Diagram 6: front-end diagram*

`socketcontroller.js`

We are all set and can start dealing with front-end.  The idea and thinking was to allow using any front-end of your liking so the implementation consists of high level js file that handles all the communication and than exact implementation.

First we want to keep global variables that we will be using often;
<br><br>
<pre class="prettyprint">
var numOfUsersInARoomCallBackFunctionGlobal;
var messageFromRoomCallBackfunctionGlobal;
var userRegisteredCallBackFunctionGlobal;
var userConnectedCallBackFunctionGlobal;
var stateChangeCallBackFunctionGlobal;
var DEBUG_MODE = false;
var roomSetup;
</pre>
<br><br>
At the init of the API it will act as a class constructor and we can pass all the variables or keep null the ones we don't need.  The names are self explanatory to what each method does.
<br><br>
<pre class="prettyprint">
function SocketController(connectURL,roomSetup,userConnectedCallBackFunction,userRegisteredCallBackFunction,
                          messageFromRoomCallBackfunction,numOfUsersInARoomCallBackFunction,stateChangeCallBackFunction,debugMode) {

    DEBUG_MODE = debugMode;
    this.connectURL = connectURL;
    this.roomSetup = roomSetup;
    numOfUsersInARoomCallBackFunctionGlobal = numOfUsersInARoomCallBackFunction;
    messageFromRoomCallBackfunctionGlobal = messageFromRoomCallBackfunction;
    userRegisteredCallBackFunctionGlobal =userRegisteredCallBackFunction;
    userConnectedCallBackFunctionGlobal = userConnectedCallBackFunction;
    stateChangeCallBackFunctionGlobal = stateChangeCallBackFunction;
    var socket;
</pre>
<br><br>

We set a methods so we can accept messages through `websocket` to our room, that's what `sendMessageToSocket` and `emitMessageToSocket` is for. `registerUser` is a specific message to register the user.  Notice that we are using here the same message type enum file we used in the back-end implementation.

<br><br>
<pre class="prettyprint">

    this.sendMessageToSocket = function(message) {
        socket.send(message);
        sendMessageToLog('message to room: ' + message);
    }

    this.emitMessageToSocket = function(message, data) {
        socket.emit(message,data);
        sendMessageToLog('emit message to room: ' + message);
    }

    this.registerUser = function(userId) {
        var data = new Object();
        data.userId=userId;
        data.roomName = this.roomSetup.roomName;
        this.emitMessageToSocket(REGISTER,data);

        userRegisteredCallBackFunctionGlobal();
    }
</pre>
<br><br>

To store a state we pass the state object type and `userId`, `name` and `stateName`.  The state name is needed so can identify the object, so in my implementation (as you will see next), I am using value object type of object but you can do this anyway you want.

<br><br>
<pre class="prettyprint">

    this.storeState = function(stateVO,stateName,userId) {
        var object = new Object();
        object.name = stateName;
        object.vo = stateVO;
        object.userId = userId;
        sendMessageToLog('store state '+stateName);
        this.emitMessageToSocket(STORE_STATE,object);
    }
</pre>
<br><br>
`getNumberOfRegisteredUsersInRoom` is a common request that a client can make to find out how many people are in the room.  The user can also subscribe to messages and room information and get live information, but this is more intended for users that didn't subscribe to the room information.
<br><br>
<pre class="prettyprint">

    this.getNumberOfRegisteredUsersInRoom = function(userId) {
        var data = new Object();
        data.userId=userId;
        data.room = this.roomSetup.roomName;
        this.emitMessageToSocket(REQUEST_NUM_OF_USERS,data);
        sendMessageToLog('request num of users in a room');
    }
</pre>
<br><br>
The messages below;

* `getState` - sending a state change.
* `connectToSocket` - sending a connection to socket, needed when to get started.
* `callDbConnector` - sending a request to database service call or any other 3rd party service call.

<br><br>
<pre class="prettyprint">

    this.getState = function(userId,stateName) {
        sendMessageToLog('get state: '+stateName);
        var data = new Object();
        data.userId=userId;
        data.room = this.roomSetup.roomName;
        data.stateName = stateName;
        this.emitMessageToSocket(GET_STATE,data);
    }

    this.connectToSocket = function() {
        socket = io.connect(this.connectURL);
        sendMessageToLog('connecting to socket.io on: ' + connectURL);
        this.listenToMessagesFromSocket();
    }


    this.callDbConnector = function(userId, methodName) {
        var data = new Object({userId: userId, methodName: methodName, room: roomSetup.roomName});
        this.emitMessageToSocket('dbconnector',data);
    }

</pre>
<br><br>

Than we can listen to messages

* `DBCONNECTOR` - listing to a message back with the results of the service call.
* `MESSAGE` - listening to any message from the websocket.
* `REQUEST_NUM_OF_USERS` - respond to a request to know how many ppl in the room.
* `GET_STATE` -  listening to a respond to get a state object.
* `STATE_CHANGE` - listening to any state change when user subscribe to messages.

<br><br>
<pre class="prettyprint">

        socket.on(DBCONNECTOR, function (data) {
            sendMessageToLog('dbconnector message back, methodName: ' + data.data.methodName);

            if (messageFromRoomCallBackfunctionGlobal != null)
                messageFromRoomCallBackfunctionGlobal(data);
        });

        socket.on(MESSAGE, function (data) {
            sendMessageToLog('message from room');
            if (messageFromRoomCallBackfunctionGlobal != null)
                messageFromRoomCallBackfunctionGlobal(data);
        });

        socket.on(REQUEST_NUM_OF_USERS, function (data) {
            sendMessageToLog('numberOfUsersInRoom message: ' + data.size);
            if (numOfUsersInARoomCallBackFunctionGlobal != null)
                numOfUsersInARoomCallBackFunctionGlobal(data);
        });

        socket.on(GET_STATE, function (data) {
            sendMessageToLog('get state results: ' + data.name);
            messageFromRoomCallBackfunctionGlobal(data.vo);
        });

        socket.on(STATE_CHANGE, function (data) {
            sendMessageToLog('get state change: ' + data.name);
            stateChangeCallBackFunctionGlobal(data.vo);
        });
</pre>
<br><br>

Front-end implementation
========================

`controller.js`

<br><br>
<pre class="prettyprint">

var isAutoConnect = false;
var socketController;
var userId = makeid(10);
var roomName = roomName = window.location.hostname;

function listenToUserActions() {

    $("#getResultsButton").bind('click', function() {
            socketController.callDbConnector(userId,'getItems');
        }
    );
}
</pre>

<br><br>
<pre class="prettyprint">

function connectToSocket() {
    var hostName = window.location.hostname;
    var port = (hostName != '0.0.0.0' && hostName != 'localhost') ? '80' : '8081';
    var connectURL = 'http://'+window.location.hostname+':'+port;

    var roomSetup = new Object();
    roomSetup.roomName = roomName;
    roomSetup.subscriptions = new Object();
    roomSetup.subscriptions['RoomInfoVO'] = true;

    socketController = new SocketController(connectURL,roomSetup,userConnectedCallBackFunction,userRegisteredCallBackFunction,
        messageFromRoomCallBackfunction,numOfUsersInARoomCallBackFunction,stateChangeCallBackFunction, true);
    socketController.connectToSocket();
}

</pre>
<br><br>

We can than implement these methods:

* `userConnectedCallBackFunction`
* `userRegisteredCallBackFunction`
* `numOfUsersInARoomCallBackFunction`
* `messageFromRoomCallBackfunction`

<br><br>
<pre class="prettyprint">

function userConnectedCallBackFunction() {
    if (isAutoConnect)
        socketController.registerUser(userId);
}

function userRegisteredCallBackFunction() {
    socketController.getNumberOfRegisteredUsersInRoom(userId);
}

function numOfUsersInARoomCallBackFunction(data) {
    var numofppl = data.size;
    document.getElementById('visitors').innerHTML = '<div style="font-size: 15px; top: 5px">Currently there are <b>'+numofppl+'</b> visitors on this page</div>';

    if (data.hasOwnProperty('register')) {
        console.log('register userId: ' + data.register);
    } else if (data.hasOwnProperty('disconnect')) {
        console.log('disconnect userId: ' + data.disconnect);
    }
}

function messageFromRoomCallBackfunction(data) {
    console.log('messageFromRoomCallBackfunction: '+data.vo.name);
    console.log(JSON.stringify(data.vo));
}
</pre>
<br><br>

Once the document is ready, we can connect the user and listen to any user actions;

<br><br>
<pre class="prettyprint lang=javascript">

$(document).ready(function() {
    connectUser();
    listenToUserActions();
});

function connectUser() {
    isAutoConnect = true;
    connectToSocket();
}
</pre>
<br><br>
`makeid` is a utility that allows us to create a userId, this can be generated in many different ways;
<br><br>
<pre class="prettyprint">

function makeid(numOfChar)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < numOfChar; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
</pre>

The implementation can be than any front-end to your liking such as: [Emberjs](http://emberjs.com/), [AngularJS](http://angularjs.org/), [backbonejs](http://backbonejs.org/) and template engines such as [Jadejs](http://jade-lang.com/).  In my example I am just using `jquery` for simplicity.

:)

