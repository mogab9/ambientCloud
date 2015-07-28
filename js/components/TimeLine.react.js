
var React          = require('react');
var PlayerActions  = require('../actions/PlayerActions');

var TimeLine = React.createClass({

  // On mount start ticking
  componentDidMount: function() {
   this._updateEverySecond();
  },

  componentWillUnmount: function() {
    clearTimeout(this.interval);
  },

  _updateEverySecond: function() {
    var self = this;
    this.interval = setTimeout(function() {
      PlayerActions.refreshTimeline(self.props.player.id);
      self._updateEverySecond();
    }, 1000);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <input readOnly type="range" min="0" max="100" value={this.props.player.currentTimePct} />
    );
  },

});

module.exports = TimeLine;
