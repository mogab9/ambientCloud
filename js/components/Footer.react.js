
var React         = require('react');
var PlayerActions = require('../actions/PlayerActions');
var TimeLine = require('./TimeLine.react');
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
        <button className={player.pause ? 'play' : 'pause' } onClick={this._onPlayPause} >
            <p>
                {player.pause ? '>' : '||' }
            </p>
        </button>
        <button className="soundnext" onClick={this._onSoundNext} > <p> >| </p> </button>
        <button className="soundless" onClick={this._onSoundLess} > <p> - </p> </button>
        <button className="soundup" onClick={this._onSoundUp} > <p> + </p> </button>
        <div className="volContainer">
            <div className="volInfo"
            style={{ left:  (player.volume * 100).toFixed(0) + '%' }}><p>{(player.volume * 10).toFixed(0)}</p></div>
        </div>
        <TimeLine
          player={this.props.player}
        />
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
