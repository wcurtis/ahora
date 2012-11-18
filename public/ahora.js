
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
  socket.on('message', function(msg){msgReceived(msg)});
});
