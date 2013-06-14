var numOfUsersInARoomCallBackFunctionGlobal;
var messageFromRoomCallBackfunctionGlobal;
var userRegisteredCallBackFunctionGlobal;
var userConnectedCallBackFunctionGlobal;
var stateChangeCallBackFunctionGlobal;
var DEBUG_MODE = false;
var roomSetup;

sendMessageToLog = function(msg) {
    if (DEBUG_MODE)
        console.log(msg);
}

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

    this.storeState = function(stateVO,stateName,userId) {
        var object = new Object();
        object.name = stateName;
        object.vo = stateVO;
        object.userId = userId;
        sendMessageToLog('store state '+stateName);
        this.emitMessageToSocket(STORE_STATE,object);
    }

    this.getNumberOfRegisteredUsersInRoom = function(userId) {
        var data = new Object();
        data.userId=userId;
        data.room = this.roomSetup.roomName;
        this.emitMessageToSocket(REQUEST_NUM_OF_USERS,data);
        sendMessageToLog('request num of users in a room');
    }

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

    this.listenToMessagesFromSocket = function() {
        sendMessageToLog('listenToMessages for room: '+roomSetup.roomName);
        socket.on(CONNECT, function(data) {
            socket.emit(JOIN_ROOM, roomSetup );
            sendMessageToLog('connect to room: '+roomSetup.roomName);
            userConnectedCallBackFunctionGlobal();
        });

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
    }
}