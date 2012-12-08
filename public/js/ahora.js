
function msgReceived(msg){
  if(msg.clients) {
    $clientCounter.html(msg.clients);
  } else if (msg.song) {
    // Song buffers automatically when created
    var song = new Audio(msg.song);
    song.play();
    console.log('Playing song: ' + msg.song);
  }
}

$(document).ready(function () {
  $clientCounter = $("#client_count")

  var socket = io.connect();
  socket.on('connect', function() {
    if (typeof dw_key !== 'undefined') {
      socket.emit('subscribe', {key:dw_key});
    }
    console.log('Connected to socket.io');
  })
  socket.on('message', function(msg){msgReceived(msg)});
});
