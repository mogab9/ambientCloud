
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
  * Display timeline time for given time. Format is 00:00
  * @param {float} time  a time in seconds
  */
  _displayTime: function(time) {
    var min = seconds = '~~';

    if (!isNaN(time)) {
      var min     = Math.floor(time.toFixed(0) / 60);
      var seconds = time.toFixed(0) % 60;
      if (min < 10)
        min = '0'+ min;
      if (seconds < 10)
        seconds = '0' + seconds;
    }

    return min + ':' + seconds;
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div id="timeline">
        <p id="current">{this._displayTime(this.props.player.currentTime)} /</p>
        <p id="duration">{this._displayTime(this.props.player.duration)}</p>
      </div>
    );
  },

});

module.exports = TimeLine;
