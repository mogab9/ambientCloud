
var React          = require('react');
var ReactPropTypes = React.PropTypes;
var PlayerActions  = require('../actions/PlayerActions');
var PlayerStore    = require('../stores/PlayerStore');
var PlayerItem     = require('./PlayerItem.react');

var MainSection = React.createClass({
  getInitialState: function() {
    // bootstrap first player as initial state
    PlayerActions.create();

    return {initialPlayer: PlayerStore.getAll()};
  },

  /**
   * @return {object}
   */
  render: function() {
    // if rendering from getInitialState: use initial player list key
    // else:                              use normal players list key
    if (this.state.hasOwnProperty('initialPlayer')) {
      var allPlayers = this.state.initialPlayer;
    } else if (Object.keys(this.props).length === 0 || Object.keys(this.props.allPlayers).length < 1) {
      return (<span/>);
    } else {
      var allPlayers = this.props.allPlayers;
    }

    return (
      <section id="main">
        <ul id="player-list">
          {
            Object.keys(allPlayers).map( function( value, index ) {
              return (
                <PlayerItem key={index} player={allPlayers[value]} />
              )
            })
          }
        </ul>
      </section>
    );
  },

});

module.exports = MainSection;
