var io = require('socket.io')();
var moment = require('moment');
var _ = require('underscore');
// Listen for new connections from clients (socket)
// io.on('connection', function (socket) {
//  console.log('Client connected to socket.io!');
// });
var users = [];
var timer = 30;
var gameWord = '';
var gameGuess = '';
var button = true;
var dictionary = [
//easy words
'cat', 'sun', 'cup',
'ghost', 'flower', 'pie',
'cow', 'banana', 'snowflake',
'bug', 'book', 'jar',
'snake', 'light', 'tree',
'lips', 'apple', 'slide',
'socks', 'smile', 'swing',
'coat', 'shoe', 'water',
'heart', 'hat', 'ocean',
'kite', 'dog', 'mouth',
'milk', 'duck', 'eyes',
'skateboard', 'bird', 'boy',
'apple', 'person', 'girl',
'mouse', 'ball', 'house',
'star', 'nose', 'bed',
'whale', 'jacket', 'shirt',
'hippo', 'beach', 'egg',
'face', 'cookie', 'cheese',
'icecream', 'cone', 'drum', 'circle',
'spoon', 'worm', 'spider', 'web',
'bridge', 'bone', 'grapes',
'bell', 'jellyfish', 'bunny',
'truck', 'grass', 'door',
'monkey', 'spider', 'bread',
'ears', 'bowl', 'bracelet',
'alligator', 'bat', 'clock',
'lollipop', 'moon', 'doll',
'orange', 'ear', 'basketball',
'bike', 'airplane', 'pen',
'inchworm', 'seashell', 'rocket',
'cloud', 'bear', 'corn',
'chicken', 'purse', 'glasses',
'blocks', 'carrot', 'turtle',
'pencil', 'horse', 'dinosaur',
'head', 'lamp', 'snowman',
'ant', 'giraffe', 'cupcake',
'chair', 'leaf', 'bunk', 'bed',
'snail', 'baby', 'balloon',
'bus', 'cherry', 'crab',
'football', 'branch', 'robot',

//medium words
'horse', 'door', 'song',
'trip', 'backbone', 'bomb',
'round', 'treasure', 'garbage',
'park', 'pirate', 'ski',
'state', 'whistle', 'palace',
'baseball', 'coal', 'queen',
'dominoes', 'photograph', 'computer',
'hockey', 'aircraft', 'hot', 'dog',
'salt-and-pepper', 'key', 'iPad',
'whisk', 'frog', 'lawnmower',
'mattress', 'pinwheel', 'cake',
'circus', 'battery', 'mailman',
'cowboy', 'password', 'bicycle',
'skate', 'electricity', 'lightsaber',
'thief', 'teapot', 'deep',
'spring', 'nature', 'shallow',
'toast', 'outside', 'America',
'rollerblading', 'gingerbreadman', 'bowtie',
'half', 'spare', 'wax',
'light', 'bulb', 'platypus', 'music',

//medium words 2
'sailboat', 'popsicle', 'brain',
'birthday', 'cake', 'skirt', 'knee',
'pineapple', 'tusk', 'sprinkler',
'money', 'spool', 'lighthouse',
'doormat', 'face', 'flute',
'rug', 'snowball', 'purse',
'owl', 'gate', 'suitcase',
'stomach', 'doghouse', 'pajamas',
'bathroom', 'scale', 'peach', 'newspaper',
'watering', 'can', 'hook', 'school',
'beaver', 'french', 'fries', 'beehive',
'beach', 'artist', 'flagpole',
'camera', 'hair', 'dryer', 'mushroom',
'toe', 'pretzel', 'TV',
'quilt', 'chalk', 'dollar',
'soda', 'chin', 'swing',
'garden', 'ticket', 'boot',
'cello', 'rain', 'clam',
'pelican', 'stingray', 'fur',
'blowfish', 'rainbow', 'happy',
'fist', 'base', 'storm',
'mitten', 'easel', 'nail',
'sheep', 'stoplight', 'coconut',
'crib', 'hippopotamus', 'ring',
'seesaw', 'plate', 'fishing', 'pole',
'hopscotch', 'bell', 'pepper', 'front', 'porch',
'cheek', 'video', 'camera', 'washing', 'machine',
'telephone', 'silverware', 'barn',
'snowflake', 'bib', 'flashlight',
'popsicle', 'muffin', 'sunflower',
'skirt', 'top', 'hat', 'swimming pool',
'tusk', 'radish', 'peanut',
'spool', 'poodle', 'potato',
'face', 'shark', 'fang',
'snowball', 'waist', 'spoon',
'gate', 'bottle', 'mail',
'sheep', 'lobster', 'ice',
'crib', 'lawn', 'mower', 'bubble',
'seesaw', 'pencil', 'cheeseburger',
'hopscotch', 'rocking', 'chair', 'corner',
'cheek', 'rolly', 'polly', 'popcorn',
'telephone', 'yo-yo', 'seahorse',
'snowflake', 'spine', 'desk',

// REALLY HARD WORDS
'vision', 'loiterer', 'observatory',
'century', 'Atlantis', 'kilogram',
'neutron', 'stowaway', 'psychologist',
'exponential', 'aristocrat', 'eureka',
'parody', 'cartography', 'figment',
'philosopher', 'tinting', 'overture',
'opaque', 'Everglades', 'ironic',
'zero', 'landfill', 'implode',
'czar', 'armada', 'crisp',
'stockholder', 'inquisition', 'mooch',
'gallop', 'archaeologist', 'blacksmith',
'addendum', 'upgrade', 'hang', 'ten',
'acre', 'twang', 'mine', 'car',
'protestant', 'brunette', 'stout',
'quarantine', 'tutor', 'positive',
'champion', 'pastry', 'tournament',
'Chick-fil-A', 'rainwater', 'random',
'lyrics', 'ice', 'fishing', 'clue',
'flutter', 'slump', 'ligament',
'flotsam', 'siesta', 'pomp'
];

io.on('connection', function (socket) {
    console.log("user connected")
    socket.on('chat message', function (userData) {
        io.emit('chat message', userData);
    });
    // A User starts a path
    socket.on('startPath', function (data, sessionId) {
        io.emit('startPath', data, sessionId);
    });
    // A User continues a path
    socket.on('continuePath', function (data, sessionId) {
        io.emit('continuePath', data, sessionId);
    });
    // A user ends a path
    socket.on('endPath', function (data, sessionId) {
        io.emit('endPath', data, sessionId);
    });

    socket.on('clear-canvas', function () {
        io.emit('clear-canvas');
    });

    socket.on('enteredRoom', function (msg) {
        io.emit('enteredRoom', msg);
        users.push({
            name: msg,
            socketId: socket.id
        });
    });

    socket.on('addUser', function (sessionId) {
        users[users.length - 1].id = sessionId;
        console.log(users);
    });

    socket.on('disconnect', function () {
        for (var i = 0; i < users.length; i++) {
            if (users[i].socketId == socket.id) {
                users.splice(i, 1);
            }
        }
        socket.leave(socket.id);

    })

    socket.on('word', function (word) {
        gameWord = word;
    })

    socket.on('guess', function (guess) {
        gameGuess = guess;
        rightGuess();
    })

    socket.on('startGame', function () {
        if (button == true) {
            io.emit('userTurn', {
                users: users[0].id,
                words: _.sample(dictionary)
            })
            startTimer();
            button = false;
        }
    })

    socket.on('skip', function () {
        console.log('win');
        io.emit('winTurn', gameWord);
        timer = 30;
        var end = users.splice(0, 1)[0];
        users.push(end);
        clearInterval(timerID);
        io.emit('endDraw')

        button = true;
    })

    function startTimer() {
        timer = timer + 1;
        io.emit('turn', users[0].name);
        timerID = setInterval(function (e) {
            timer--;
            io.emit('startGame', timer);
            if (timer <= 0) {
                timer = 30;
                var end = users.splice(0, 1)[0];
                users.push(end);
                clearInterval(timerID);
                io.emit('endDraw')
                button = true;
            }
            console.log(timer);
        }, 1000);
    }

    function rightGuess() {
        if (gameGuess == gameWord) {
            console.log('win');
            io.emit('winTurn', gameWord);
            timer = 30;
            var end = users.splice(0, 1)[0];
            users.push(end);
            clearInterval(timerID);
            io.emit('endDraw')

            button = true;
        }
    }

}); // io represents socket.io on the server - let's export it


module.exports = io;