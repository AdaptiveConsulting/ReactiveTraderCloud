/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');

var dataGenerator = require('./dataGenerator');

var Chart = require('./Chart');

require('./App.less');

var App = React.createClass({
  getInitialState: function() {
    var domain = [0, 30];
    return {
      data: this.getData(domain),
      domain: {x: domain, y: [0, 100]},
      tooltip: null,
      prevDomain: null,
      showingAllTooltips: false
    };
  },

  _allData: dataGenerator.generate(50),

  getData: function(domain) {
    return _.filter(this._allData, this.isInDomain.bind(null, domain));
  },

  addDatum: function(domain) {
    this._allData.push(dataGenerator.generateDatum(domain));
    return this.getData(domain);
  },

  removeDatum: function(domain) {
    var match = _.find(this._allData, this.isInDomain.bind(null, domain));
    if (match) {
      this._allData = _.reject(this._allData, {id: match.id});
    }
    return this.getData(domain);
  },

  isInDomain: function(domain, d) {
    return d.x >= domain[0] && d.x <= domain[1];
  },

  render: function() {
    return (
      <div className="App">
        <Chart
          appState={this.state}
          setAppState={this.setAppState} />
      </div>
    );
  },

  setAppState: function(partialState, callback) {
    return this.setState(partialState, callback);
  }
});

module.exports = App;
