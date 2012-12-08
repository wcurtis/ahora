
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

});
