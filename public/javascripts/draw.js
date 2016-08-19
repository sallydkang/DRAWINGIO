var socket = io();
// -----------
// Setup
// -----------
// io=io.connect('/');
// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger/smaller than this
//tool.maxDistance = 2;
//tool.maxDistance = 80;

// Each user has a unique session ID
// We'll use this to keep track of paths
socket.sessionid = Math.floor(Math.random() * 64000).toString(16);
var sessionId = socket.sessionid;
// var sessionId = "23j4"

var clear = document.getElementById('clearbutton');
var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");

//    console.log(socket);
socket.on('clear-canvas', function (data) {
    clearCanvas(data);
})

clear.addEventListener('click', function () {
    socket.emit('clear-canvas');
});

// Returns an object specifying a semi-random color
function randomColor() {
    return {
        hue: Math.random() * 360,
        saturation: 0.8,
        brightness: 0.8,
        alpha: 0.5
    };
}

// An object to keep track of each users paths
// We'll use session ID's as keys
paths = {};

// -----------
// User Events
// -----------


// The user started a path
function onMouseDown(event) {
    console.log(socket.sessionid);
    // Create the new path
    color = randomColor();
if(drawDisable === true){
    startPath(event.point, color, sessionId);
    // Inform the backend
    emit("startPath", {
        point: event.point,
        color: color
    }, sessionId);
}

}

function onMouseDrag(event) {

    var step = event.delta / 2;
    step.angle += 90;
    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;
if(drawDisable === true){
    continuePath(top, bottom, sessionId);

    // Inform the backend
    emit("continuePath", {
        top: top,
        bottom: bottom
    }, sessionId);
}

}

function onMouseUp(event) {
if(drawDisable === true){
    endPath(event.point, sessionId);

    // Inform the backend
    emit("endPath", {
        point: event.point
    }, sessionId);
}
}






// -----------------
// Drawing functions
// Use to draw multiple users paths
// -----------------


function startPath(point, color, sessionId) {
    paths[sessionId] = new Path();
    paths[sessionId].fillColor = color;
    paths[sessionId].add(point);
    view.draw()
}

function continuePath(top, bottom, sessionId) {
    var path = paths[sessionId];

    path.add(top);
    path.insert(0, bottom);
    view.draw()
}

function endPath(point, sessionId) {
    var path = paths[sessionId];
    path.add(point);
    path.closed = true;
    path.smooth();
    delete paths[sessionId]
    view.draw()
}

function clearCanvas() {
    project.clear()
}




// -----------------
// Emit
// Use to inform the server of user events
// -----------------


function emit(eventName, data) {
    socket.emit(eventName, data, sessionId);
}

// -----------------
// On
// Draw other users paths
// -----------------


socket.on('startPath', function (data, sessionId) {
    console.log("received start path")

        // console.log(data.point)
        var point = {
            x: data.point[1],
            y: data.point[2]
        }
        startPath(point, data.color, sessionId);
})


socket.on('continuePath', function (data, sessionId) {
    if (sessionId !== socket.sessionid) {
        console.log("received continue path")
        var top = {
            x: data.top[1],
            y: data.top[2]
        }
        var bottom = {
            x: data.bottom[1],
            y: data.bottom[2]
        }
        continuePath(top, bottom, sessionId);
    }
    view.draw();
})

socket.on('endPath', function (data, sessionId) {
        if (sessionId !== socket.sessionid) {
            console.log("received end path")
            var point = {
                x: data.point[1],
                y: data.point[2]
            }
            endPath(point, sessionId);
        }
        view.draw();
    })

//add user to array
$('#submitName').click(function () {
    socket.emit('addUser', sessionId);
    $('#submitName').prop('disabled', true);
})

//remove user from array

var drawDisable = false;


socket.on('userTurn', function (userTurn) {
    var $userInput = $('#m');
    if (sessionId == userTurn.users) {
        drawDisable = true;
        $('#messages').append($('<li id="drawWord">Your word is: ' + userTurn.words + '</li>'));
    }
    socket.emit('word', userTurn.words);
})

socket.on('guessWord', function (guessTurn) {

})

socket.on('endDraw', function(){
     socket.emit('clear-canvas');
    drawDisable= false;
})


