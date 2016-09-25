// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
/*  
  $.get('/dreams', function(dreams) {
    dreams.forEach(function(dream) {
      $('<li></li>').text(dream).appendTo('ul#dreams');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    dream = $('input').val();
    $.post('/dreams?' + $.param({dream: dream}), function() {
      $('<li></li>').text(dream).appendTo('ul#dreams');
      $('input').val('');
      $('input').focus();
    });
  });


 $('form').submit(function(event) {
    event.preventDefault();
    code = $('input').val();
    $.post('/getPlayer?' + $.param({code: code}), function(d) {
      $('#player').text(d.code + ' - ' + d.name + ' (' + d.points + ')');
      $('input').val('');
      $('input').focus();
    });
  });
});
*/

$('form').submit(function(event) {
    event.preventDefault();
    codes = $('input').val();
    $.post('/getPlayers?' + $.param({codes: codes}), function(players) {
    
      console.log(players)
      var playerHtml = '';
      var totalPoints = 0;
      
      players.sort(function(a, b) {
    return parseInt(b.points) - parseInt(a.points);
      });
      
      players.forEach(function (player) {
        playerHtml = playerHtml + player.code + ' - ' + player.name + ' (' + player.points + ')<br/>'; 
        totalPoints += parseInt(player.points);
      });
    
      $('#player').html(playerHtml);
      $('#totalPoints').text(totalPoints);
      $('input').val('');
      $('input').focus();
    });
  });
