
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
    socket.emit('subscribe', {key:dw_key});
    console.log('connectedddd');
  })
  socket.on('message', function(msg){msgReceived(msg)});
});
