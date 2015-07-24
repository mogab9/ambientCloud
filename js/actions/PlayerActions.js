
var AppDispatcher         = require('../dispatcher/AppDispatcher');
var AmbientCloudConstants = require('../constants/AmbientCloudConstants');

var PlayerActions = {

  create: function() {
    AppDispatcher.dispatch({
      actionType: AmbientCloudConstants.PLAYER_CREATE
    });
  },

  /**
   * @param  {string} Player's id
   */
  playpause: function(id) {
    AppDispatcher.dispatch({
      actionType: AmbientCloudConstants.PLAYER_PLAYPAUSE,
      id:         id
    });
  },

  /**
   * @param  {string} Player's id
   */
  soundup: function(id) {
    AppDispatcher.dispatch({
      actionType: AmbientCloudConstants.PLAYER_SOUNDUP,
      id:         id
    });
  },

  /**
   * @param  {string} Player's id
   */
  soundless: function(id) {
    AppDispatcher.dispatch({
      actionType: AmbientCloudConstants.PLAYER_SOUNDLESS,
      id:         id
    });
  },

};

module.exports = PlayerActions;
