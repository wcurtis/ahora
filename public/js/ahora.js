
function msgReceived(msg){
  if(msg.clientCount) {
    $('#listener-count').html(msg.clientCount);
  } 
  if (msg.song) {
    // Function in hook.js
    playAudio(msg.song);
  } 
  if (msg.hits) {
    $('#hit-count').html(msg.hits);
  } 
  if (msg.lastHit) {
    $('#last-hit').html(msg.lastHit);
  }
}

$(document).ready(function () {
  var socket = io.connect();
  socket.on('connect', function() {
    if (typeof hook_key !== 'undefined') {
      socket.emit('subscribe', {key:hook_key});
    }
    console.log('Connected to socket.io');
  })
  socket.on('message', function(msg){msgReceived(msg)});
});
