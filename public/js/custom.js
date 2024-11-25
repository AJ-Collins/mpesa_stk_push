// hide show sign in form

$(document).ready(function() {
    $('.reg-button span a').click(function(e) {
         $(this).closest('#show-signin').toggleClass('show-signin');
   });
});
