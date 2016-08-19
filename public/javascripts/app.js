// socket by Egan & Antonio
document.addEventListener("DOMContentLoaded", function () {
    var socket = io();
    var nickName = '';
    var $nickName = $('#nickName');
    var start = $('#startButton');
    var guess = $('#m');
    var $secretButton = $('#secretButton');

    $('#nicknamePOP').modal('show');
    $('form').submit(function () {
        socket.emit('chat message', `${$('#m').val()};${nickName}`);
        socket.emit('guess', guess.val());
        guess.val('');
        return false;
    });


    socket.on('chat message', function (userData) {
        var data = userData.split(';');
        var momentTimestamp = moment.utc(data[0].timestamp);
        if (nickName.length > 0) {
            data[0].timestamp = moment().valueOf()
            $('#messages').append($('<i class="fa fa-commenting-o" aria-hidden="true" id="upMsg">').text(' ' + data[1] + ': ' + data[0] + ' ' + momentTimestamp.local().format('h:mm a')));
        } else {
            $('#nicknamePOP').modal('show');
        }
    })

    $('#submitName').click(function () {
        nickName = $nickName.val()
        $('#nicknamePOP').modal('hide');
        if (nickName.length > 0) {
            socket.emit('enteredRoom', nickName)
        }
    })
    
//    window.onbeforeunload = function (e) {
//    socket.emit('removeUser', nickName)
//};
    
    socket.on('enteredRoom', function (msg) {
        $('#messages').append($('<i class="fa fa-commenting-o" aria-hidden="true" id="upMsg">').text(' ' + msg + ' has entered the room '))
    });
    
    socket.on('startGame', function (timer) {
         $('#timer').html(timer);
    })
    
    start.click(function() {
        socket.emit('startGame'); 
    })
    
    socket.on('turn', function(name){
         $('#messages').append('<br/>' +name + ' is drawing...');
    })
    
    socket.on('winTurn', function(gameWord){
         $('#messages').append(gameWord + ' is correct!!');
    })
    
    $secretButton.click(function(){
        socket.emit('skip')
    })
    
});