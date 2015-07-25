
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
        <button className="soundnext" onClick={this._onSoundNext} > >| </button>
        <button className="soundless" onClick={this._onSoundLess} > - </button>
        {(player.volume * 100).toFixed(0)} %
        <button className="soundup" onClick={this._onSoundUp} > + </button>
      </footer>
    );
  },

  _onPlayPause: function() {
    PlayerActions.playpause(this.props.player.id);
  },
  _onSoundUp: function() {
    PlayerActions.soundup(this.props.player.id);
  },
  _onSoundLess: function() {
    PlayerActions.soundless(this.props.player.id);
  },
  _onSoundNext: function() {
    PlayerActions.soundnext(this.props.player.id);
  },

});

module.exports = Footer;
