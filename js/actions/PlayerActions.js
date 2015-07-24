
var AppDispatcher         = require('../dispatcher/AppDispatcher');
var AmbientCloudConstants = require('../constants/AmbientCloudConstants');

var PlayerActions = {

  create: function() {
    AppDispatcher.dispatch({
      actionType: AmbientCloudConstants.PLAYER_CREATE
    });
  },

  /**
   * @param  {string} id
   */
  playpause: function(id) {
    AppDispatcher.dispatch({
      actionType: AmbientCloudConstants.PLAYER_PLAYPAUSE,
      id:         id
    });
  },

};

module.exports = PlayerActions;
