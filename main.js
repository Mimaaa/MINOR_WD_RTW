/* eslint-env browser */
console.log('lol');

var socket = io('http://localhost');
 socket.on('connect', function(){});
 socket.on('event', function(data){});
 socket.on('disconnect', function(){});
