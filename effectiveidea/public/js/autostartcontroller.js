var socketController;
var user_limit = 2000;
var userId;

function connectToSocket(serverURL, roomName,simultaneous_user_limit) {
    var port = 80;
    var connectURL = 'http://'+serverURL+':'+port;

    socketController = new SocketController(connectURL,roomName,userConnectedCallBackFunction,messageFromRoomCallBackfunction,numOfUsersInARoomCallBackFunction,true);
    socketController.connectToSocket();
    user_limit = simultaneous_user_limit;
    sendMessageToLog('eventId: '+roomName + ', simultaneous_user_limit: '+simultaneous_user_limit);
}

function userConnectedCallBackFunction() {
    userId = makeid(10);
    socketController.registerUser(userId);
    socketController.getNumberOfRegisteredUsersInRoom(userId);
}

function numOfUsersInARoomCallBackFunction(data) {
    if (Number(data) > user_limit) {
        sendMessageToLog('TOO MANY PEOPLE IN THE ROOM!'+data+', user_limit: '+user_limit);
        $('#bodyContainer').hide('fast', function() {
            // implement after animation complete
        });

        $('#bodyContainerRoomFull').show('fast', function() {
            // implement after animation complete
        });

    } else {
        sendMessageToLog('numberOfUsersInRoom: '+data);
    }
}

function messageFromRoomCallBackfunction(data) {
    // alert('messageFromRoomCallBackfunction: '+data+', user_limit: '+user_limit);
}

function makeid(numOfChar)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < numOfChar; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}