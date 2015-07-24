
var React = require('react');

var Header = React.createClass({
  /**
   * @return {object}
   */
  render: function() {

    if (this.props.player.track == null)
      return null;

    return (
      <header id="header">
        <h1>{this.props.player.track.user.username}- {this.props.player.track.title}</h1>
        <img src={this.props.player.track.artwork_url} />
      </header>
    );
  },

});

module.exports = Header;
