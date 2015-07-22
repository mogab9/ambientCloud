ambientCloud = function() {

  var client_id           = 'YOUR_CLIENT_ID'; // default id if you don't want to provide auth
  var player_id_selector  = 'player';
  var audio               = null;
  var track               = null;
  var controls_btn        = {
    'play_pause': null
  };
  var is_player_auto_play = true;
  var search_limit        = 200;             // pagination limit while searching tracks
  var search_query        = {
    q:            'ambient',
    genre_or_tag: 'ambient ambient',
    limit:        200                      // max value is 200
  };

  var init = function() {
    if (typeof(SC) !== 'object') {
      alert('Soundcloud not initialized');
      return false;
    }
    // Authenticate to Soundcloud
    SC.initialize({
      client_id: client_id
    });
    btn_add_listeners();
    if (is_player_auto_play)
      play_random_track();
  };

  var play_random_track = function() {
    SC.get('/tracks', search_query, function(trackList) {
      track = pick_random_track(trackList);
      SC.stream("/tracks/"+track.id, play);
    });
  };

  var pick_random_track = function(list_track) {
    if (list_track === null || list_track.length === 0)
      alert('No tracklist found');

    var min   = 0;
    var max   = list_track.length-1;
    var index = Math.floor(Math.random()*(max-min+1)+min);

    return list_track[index];
  };

  var play = function(sound) {
    audio = sound;
    audio.play();

    controls_btn.play_pause.innerText = "||";
    refresh_interface();
  };

  var refresh_interface = function() {
    var track_name    = document.getElementById("track-name");
    var track_picture = document.getElementById("track-picture");

    track_name.innerText = track.user.username + "-" + track.title;

    var img = document.createElement("img");
    img.src = track.artwork_url;
    track_picture.appendChild(img);
  };

  var btn_add_listeners = function() {
    var all_controls        = document.getElementById('controls');
    controls_btn.play_pause = all_controls.getElementsByClassName('playPause')[0];

    controls_btn.play_pause.addEventListener("click", function toggle_play_pause_btn() {
      if (audio._player._html5Audio.paused) {
        audio.play();
        controls_btn.play_pause.innerText = "||";
      } else {
        audio.pause();
        controls_btn.play_pause.innerText = ">";
      }
    }, false);
  };

  return{init:init, play:play, refresh_interface:refresh_interface}
}();
ambientCloud.init();
