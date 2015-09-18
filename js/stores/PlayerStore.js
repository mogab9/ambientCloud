
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
  var idPlayer = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  var idClient = '7b28010ab3f325e07a179815457497b6';

  _player[idPlayer] = {
    id             : idPlayer,
    client_id      : idClient,
    audio          : null,                   // contains Soundcloud audio object with its audio player's data
    volume         : 0.5,
    currentTime    : 0,
    currentTimePct : 0,
    duration       : 0,
    pause          : true,
    track          : null,                   // contains track datas
    auto_play      : true,
    search_query   : {
      q:            'ambient',
      genre_or_tag: 'ambient ambient',
      limit:        200                      // max value is 200
    }
  };
  // Authenticate to Soundcloud
  SC.initialize({
    client_id: idClient
  });
  if (_player[idPlayer].auto_play === true)
    playRandomTrack(idPlayer);
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
 * @param  {string} player's id
 * @param {float} new volume between 0.0 and 1.0
 */
function changeVolume(id, changeVolume) {
  _player[id].volume                            = Math.min( 1, Math.max( 0, _player[id].volume + changeVolume ) );
  _player[id].audio._player._html5Audio.volume  = _player[id].volume;
}

/**
 * Pause current audio
 * @param {string} player's id
 */
function pause(idPlayer) {
  _player[idPlayer].audio.pause();
  _player[idPlayer].pause = true;
}

/**
 * Play current audio
 * @param {string} player's id
 */
function play(idPlayer) {
  _player[idPlayer].audio.play();
  _player[idPlayer].pause = false;
}

/**
 * Pause current track and play a random new track
 * @param {string} player's id
 */
function playNextTrack(idPlayer) {
  pause(idPlayer);
  playRandomTrack(idPlayer);
}

/**
 * Search a random ambient track on Soundcloud and play it on the given player
 * @param {string} player's id
 */
var playRandomTrack = function(idPlayer) {
  SC.get('/tracks', _player[idPlayer].search_query, function(trackList) {
    track = pickRandomTrack(trackList);
    _player[idPlayer].track = track;
    SC.stream("/tracks/"+track.id, {idPlayer: idPlayer}, function(audio) {
      // audio is loaded, play sound, update _player data, update volume,
      // play sound and emit event
      audio.play();
      syncPlayerWithSound(idPlayer, audio, false);
      PlayerStore.emitChange();
    });
  });
};

/**
 * Sync timeline position with player currentTime and duration
 * @param {string} player's id
 */
function refresh_timeline(idPlayer) {
  _player[idPlayer].currentTime = _player[idPlayer].audio._player._html5Audio.currentTime;
  _player[idPlayer].duration    = _player[idPlayer].audio._player._html5Audio.duration;
  if (_player[idPlayer].duration > 0)
    _player[idPlayer].currentTimePct = Math.round(_player[idPlayer].currentTime * 100 / _player[idPlayer].duration);
  // song is over, play next song
  if (_player[idPlayer].currentTime >= _player[idPlayer].duration && _player[idPlayer].pause == false)
    playNextTrack(idPlayer);
}

/**
 * Sync player item with a SC sound object
 * @param {string} player's id
 * @param {object} a Soundcloud sound object
 * @param {boolean} whether player object is in pause
 */
var syncPlayerWithSound = function(idPlayer, audio, isPause) {
  _player[idPlayer].audio                            = audio;
  _player[idPlayer].audio._player._html5Audio.volume = _player[idPlayer].volume;
  _player[idPlayer].pause                            = isPause;
  _player[idPlayer].currentTime                      = audio._player._html5Audio.currentTime;
  _player[idPlayer].duration                         = audio._player._html5Audio.duration;
}

/**
 * Pick a random ambient track from a track list and return it.
 * @param {array} a list of tracks
 * @return {object} a random ambient track
 */
var pickRandomTrack = function(trackList) {
  if (trackList === null || trackList.length === 0)
    alert('No tracklist found');

  var min   = 0;
  var max   = trackList.length-1;
  var index = Math.floor(Math.random()*(max-min+1)+min);

  return trackList[index];
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
        play(action.id);
      } else {
        pause(action.id);
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
      playNextTrack(action.id);
      break;

    case AmbientCloudConstants.PLAYER_UPDATE:
      update(action.id, {update: true});
      PlayerStore.emitChange();
      break;

    case AmbientCloudConstants.PLAYER_REFRESHTIMELINE:
      refresh_timeline(action.id);
      PlayerStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = PlayerStore;
