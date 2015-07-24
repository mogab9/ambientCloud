
var React         = require('react');
var PlayerActions = require('../actions/PlayerActions');

var Footer = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var player = this.props.player;

    if (player.track == null)
      return null;

  	return (
      <footer id="footer">
        <button className="playpause" onClick={this._onPlayPause} >
          {player.pause ? '>' : '||' }
        </button>
      </footer>
    );
  },

  _onPlayPause: function() {
    PlayerActions.playpause(this.props.player.id);
  }

});

module.exports = Footer;
