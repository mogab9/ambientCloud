
var React    = require('react');
var TimeLine = require('./TimeLine.react');
var Header   = React.createClass({

  /**
   * @return {object}
   */
  render: function() {


    if (this.props.player.track == null)
      return null;
    return (
        <header id="header">
            <div className="BG-cover">
                <div
                    style={{ backgroundImage:'url(' +
                    this.props.player.track.artwork_url
                + ')' }}></div>
            </div>
            <img src={
                this.props.player.track.artwork_url}
            />
            <h1>
                {this.props.player.track.title}- {this.props.player.track.user.username}
            </h1>
            <div className="timeBarContainer">
                <div className="timeBarInfo"
                style={{ left:  this.props.player.currentTimePct + '%' }}></div>
            </div>
        </header>
    );
  },

});

module.exports = Header;
