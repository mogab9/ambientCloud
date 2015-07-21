ambientCloud = function() {

  var client_id          = 'YOUR_CLIENT_ID'; // default id if you don't want to provide auth
  var player_id_selector = 'player';
  var player_selector    = null;
  var is_auto_embed      = true;            // embed Soundcloud player at initialization
  var search_limit       = 200;             // pagination limit while searching tracks
  var search_query       = {
    q:            'ambient',
    genre_or_tag: 'ambient ambient',
    limit:        200                      // max value is 200
  };

  var init = function() {
    if (typeof(SC) !== 'object') {
      alert('Soundcloud not initialized');
      return false;
    }
    player_selector = document.getElementById(player_id_selector);
    if (is_auto_embed)
      playRandomTrack();
  };

  var play = function(track_url) {
    SC.whenStreamingReady(function() {
      SC.oEmbed(track_url, { auto_play: true }, player_selector);
    })
  };

  var playRandomTrack = function() {
    SC.get('/tracks', search_query, function(trackList) {

      var track = pickRandomTrack(trackList);
      play(track.permalink_url);
    });
  };

  var pickRandomTrack = function(trackList) {
    if (trackList === null || trackList.length === 0)
      alert('No tracklist found');

    var min   = 0;
    var max   = trackList.length-1;
    var index = Math.floor(Math.random()*(max-min+1)+min);

    return trackList[index];
  };

  return{init:init, play:play}
}();
ambientCloud.init();
