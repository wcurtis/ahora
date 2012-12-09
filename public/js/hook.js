
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

  // bind 'myForm' and provide a simple callback function 
  $('#audio-form').ajaxForm({
      type:     'POST',
      url:      '/hook/' + hook_key,
      dataType: 'json',
      beforeSubmit: function(arr, $form, options) { 
        console.log("Request " + $.param(arr)); 
        return true;
      },
      error: function() {
        console.log("Failed");
      },
      success: function(responseText, statusText, xhr, $form) { 
        console.log("Saved " + JSON.stringify(responseText)); 
  }}); 

});
