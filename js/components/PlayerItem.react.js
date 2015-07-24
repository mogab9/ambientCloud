
var Footer         = require('./Footer.react');
var Header         = require('./Header.react');
var React          = require('react');
var ReactPropTypes = React.PropTypes;
var PlayerActions  = require('../actions/PlayerActions');

var PlayerItem = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <li
        className="PlayerItem"
        key={this.props.player.id}>
          <Header
            player={this.props.player}
          />
          <Footer
            player={this.props.player}
          />
      </li>
    );
  },

});

module.exports = PlayerItem;
