
$(document).ready(function () {

  $('#btn-copy').zclip({
      path:'/media/ZeroClipboard.swf',
      copy:$('#url-well').text(),
      beforeCopy:function(){
      },
      afterCopy:function(){
        $('#url-well').css('opacity','0.1')
          .animate({opacity: 1}, 500);
        $(this).css('color','black');
        $(this).next('.check').show();
      }
  });

  $('#btn-post').on('click', function() {

    console.log('button press');
    // POST to the url for this page
    $.post(hook_key, function(data) {
      console.log('yay');
    });
  });

  $('#btn-preview').on('click', function() {
    var mediaUrl = $('#media-url').val();
    playAudio(mediaUrl);
  });

  $('#media-url').bind('keyup input paste', function() {
    // Enable the save button
    $('#btn-save-media').removeClass('disabled')
      .removeAttr('disabled');

    // Disable the preview button
    $('#btn-preview').addClass('disabled')
      .attr('disabled', 'disabled');
  })

  // bind 'myForm' and provide a simple callback function 
  $('#audio-form').ajaxForm({
      type:     'POST',
      url:      '/hook/' + hook_key,
      dataType: 'json',
      beforeSubmit: function(arr, $form, options) { 
        $('#btn-save-media').addClass('disabled')
          .attr('disabled', 'disabled');
        console.log("Request " + $.param(arr)); 
        return true;
      },
      error: function() {
        console.log("Failed");
      },
      success: function(responseText, statusText, xhr, $form) {
        // Enable the save button
        $('#btn-preview').removeClass('disabled')
          .removeAttr('disabled');
        console.log("Saved " + JSON.stringify(responseText)); 
  }}); 

  playAudio = function (url) {
    var song = new Audio(url);
    song.play();
    doAudioAnimation();
    console.log('Playing song: ' + url);
  }


  function doAudioAnimation() {

    var element = $('#action-animation');
    element.css('marginLeft', -1000)
      .css('display', 'block');

    element
      .animate({
        opacity: 1,
        fontSize: "100px",
        marginLeft: 50
      }, 600, 'swing')
      .delay(3000)
      .animate({
        opacity: 0,
        marginLeft: 1000,
      });
  }

  $('.circle').transition({
    opacity: 0.2,
    "margin-top": "0px",
    width: "120px",
    height: "120px"
  }, 1000);

});
