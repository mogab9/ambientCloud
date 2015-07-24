
/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the PlayerStore and passes the new data to its children.
 */

var MainSection = require('./MainSection.react');
var React       = require('react');
var PlayerStore = require('../stores/PlayerStore');

/**
 * Retrieve the current Player data from the PlayerStore
 */
function getPlayerState() {
  return {
    allPlayers: PlayerStore.getAll()
  };
}

var AmbientCloudApp = React.createClass({

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {

  	return (
      <div>
        <MainSection />
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the PlayerStore
   */
  _onChange: function() {
    this.setState(getPlayerState());
  }

});

module.exports = AmbientCloudApp;
