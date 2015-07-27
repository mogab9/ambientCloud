
var AppDispatcher         = require('../dispatcher/AppDispatcher');
var EventEmitter          = require('events').EventEmitter;
var AmbientCloudConstants = require('../constants/AmbientCloudConstants');
var assign                = require('object-assign');

var CHANGE_EVENT = 'change';
// collection of audio players
var _player = {};

/**
 * Create a Player item.
 */
function create() {
  if (typeof(SC) !== 'object') {
    alert('Soundcloud not initialized');
    return false;
  }
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  // default id if you don't want to provide auth
  var client_id = 'YOUR_CLIENT_ID';

  _player[id] = {
    id           : id,
    client_id    : client_id,
    audio        : null,
    volume       : 1,
    pause        : true,
    track        : null,
    auto_play    : true,
    search_limit : 200,                      // pagination limit while searching tracks
    search_query : {
      q:            'ambient',
      genre_or_tag: 'ambient ambient',
      limit:        200                      // max value is 200
    },
    complete: false
  };
  // Authenticate to Soundcloud
  SC.initialize({
    client_id: client_id
  });
  if (_player[id].auto_play === true)
    play_random_track(id);
}

/**
 * Update a player item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _player[id] = assign({}, _player[id], updates);
}

/**
 * Update volume of a player item.
 * @param  {string} id
 * @param {float} new volume between 0.0 and 1.0
 */
function changeVolume(id, changeVolume) {
  var html5Audio     = _player[id].audio._player._html5Audio;
  _player[id].volume = Math.min( 1, Math.max( 0, _player[id].volume + changeVolume ) );
  html5Audio.volume  = _player[id].volume;
}

/**
 * Search a random ambient track on Soundcloud and play it on the given player
 * @param {string} id_player the Player's id
 */
var play_random_track = function(id_player) {
  SC.get('/tracks', _player[id_player].search_query, function(list_track) {
    track = pick_random_track(list_track);
    _player[id_player].track = track;
    SC.stream("/tracks/"+track.id, {id_player: id_player}, function(sound) {
      // sound is loaded, play sound, update _player data, update volume,
      // play sound and emit event
      sound.play();
      _player[sound._player._descriptor.id_player].audio  = sound;
      _player[sound._player._descriptor.id_player].pause  = false;
      _player[id_player].audio._player._html5Audio.volume = _player[id_player].volume;
      PlayerStore.emitChange();
    });
  });
};

/**
 * Pick a random ambient track from a track list and return it.
 * @param {array} a list of tracks
 * @return {object} a random ambient track
 */
var pick_random_track = function(list_track) {
  if (list_track === null || list_track.length === 0)
    alert('No tracklist found');

  var min   = 0;
  var max   = list_track.length-1;
  var index = Math.floor(Math.random()*(max-min+1)+min);

  return list_track[index];
};

var PlayerStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of PLAYERs.
   * @return {object}
   */
  getAll: function() {
    return _player;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {
    case AmbientCloudConstants.PLAYER_CREATE:
      create();
      PlayerStore.emitChange();
      break;

    case AmbientCloudConstants.PLAYER_PLAYPAUSE:
      // play/pause audio
      if (_player[action.id].audio._player._html5Audio.paused) {
        _player[action.id].audio.play();
        _player[action.id].pause = false;
      } else {
        _player[action.id].audio.pause();
        _player[action.id].pause = true;
      }
      update(action.id, {update: true});
      PlayerStore.emitChange();
      break;

    case AmbientCloudConstants.PLAYER_SOUNDLESS:
      changeVolume(action.id, -0.1);
      PlayerStore.emitChange();
      break;

    case AmbientCloudConstants.PLAYER_SOUNDUP:
      changeVolume(action.id, 0.1);
      PlayerStore.emitChange();
      break;

    case AmbientCloudConstants.PLAYER_SOUNDNEXT:
      _player[action.id].audio.pause();
      play_random_track(action.id);
      break;

    case AmbientCloudConstants.PLAYER_UPDATE:
      update(action.id, {update: true});
      PlayerStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = PlayerStore;
