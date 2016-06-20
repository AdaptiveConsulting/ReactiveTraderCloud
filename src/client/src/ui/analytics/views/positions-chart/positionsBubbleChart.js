import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import {  CurrencyPairPosition } from '../../../../services/model';
import _ from 'lodash';
import { collide, createScales, getPositionsDataFromSeries } from './chartUtil';

export default class PositionsBubbleChart extends React.Component{

  static propTypes = {
    defaultWidth: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    numNodes: React.PropTypes.number,
    data: React.PropTypes.array
  };

  static defaultProps = {
    width: 350,
    height: 300,
    title: '',
    numNodes: 9,
    data: []
  };


  constructor(props){
    super(props);
    this.state = {
      nodes: [],
      prevPositionsData: {}
    };
  }


  _isUpdateRequired(){
    let positionsData = getPositionsDataFromSeries(this.props);
    let existingPositionsData = this.state.prevPositionsData;

    let diffData = _.reduce(positionsData, function(result, value, key) {
      return _.isEqual(value, existingPositionsData[key]) ?
        result : result.concat(key);
    }, []);
    this.setState({prevPositionsData: positionsData, updateRequired: true});

    if (diffData.length > 0){
      this._createNodes();
    }

    return diffData.length > 0;
  }

  _createNodes(){
    let nodes = this.state.nodes;
    this.scales = createScales(this.props);
    let colours = ['green', 'gray', 'red'];

    let positionsData = getPositionsDataFromSeries(this.props);

    let baseVals = _.map(positionsData, CurrencyPairPosition.baseTradedAmountName);
    let maxVal = _.max(baseVals);
    let minVal = _.min(baseVals);

    this.setState({maxVal: maxVal, minVal: minVal});

    for (let i = 0; i <positionsData.length; i++) {
      let dataObj = positionsData[i];
      let colorIndex = dataObj.baseTradedAmount > 0 ? 0 : dataObj.baseTradedAmount < 0 ? 2 : 1;
      let color =  dataObj.baseTradedAmount > 0 ? colours[0] : dataObj.baseTradedAmount < 0 ? colours[2] : colours[1];

      //update an existing node:
      let existingNode = _.find(nodes, (node) => node.id === dataObj.symbol);
      if (existingNode){
        existingNode.r = colorIndex === 1 ? 20 : this._getRadius(dataObj, this.scales);
        existingNode.cx = this.scales.x(i);
        existingNode.color = color;
      }else{
        nodes.push({
          id: dataObj.symbol,
          r: colorIndex === 1 ? 20 : this._getRadius(dataObj, this.scales),//this.randomRadius(scales),
          cx: this.scales.x(i),
          color: color
        });
      }
    };

    this.setState({nodes: nodes, prevPositionsData: positionsData});
    return this.state.nodes;
  }

  createChartForce(){
    let dom = ReactDOM.findDOMNode(this);
    let props = this.props;
    let g,
      nodes = this._createNodes(),
      width = this.props.width,
      height = this.props.height;

    this.scales = createScales(this.props);

    let baseVals = _.map(this.props.data, CurrencyPairPosition.baseTradedAmountName);
    let maxVal = _.max(baseVals);
    let minVal = _.min(baseVals);

    this.setState({maxVal: maxVal, minVal: minVal});

    const tick = (e)=> {
      let nodeGroup = svg.selectAll('g.node');
      let k = 10 * e.alpha;

      let nodeMap = {};

      nodeGroup.each(collide(.1, nodes, this.scales.r))
        .attr({
          transform: function(d, i) {
            nodeMap[d.id] = {x: d.x, y: d.y};
            return 'translate(' + d.x + ',' + d.y + ')';
          },
          id: function(d, i) {
            return d.id;
          }
        });

      for (let i = 0; i < this.state.nodes.length; i++){
        let node = this.state.nodes[i];
        let newSettings = nodeMap[node.id];
        node.x = newSettings.x;
        node.y = newSettings.y;
      }
    };

    let svg = d3.select(dom).append('svg')
      .attr({
        width: width,
        height: height
      });

    this.force = d3.layout.force()
        .nodes(this.state.nodes)
        .links([])
        .size([width, height])
        .charge(function(d) {
          return -1 ;//return -1 * (Math.pow(d.r * 5.0, 2.0) / 8);
        })
        .gravity(0.1)//(2.75)
        .on('tick', tick);


    this._update(this.state.nodes);
  }

  _update(nodes){

    if (!nodes) return;
    if (!this.state.updateRequired) return;
    this.setState({updateRequired: false});

    let dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');

    let nodeGroup = svg.selectAll('g.node')
      .data(nodes, function(d, i) {
        return d.id;
      });

    nodeGroup.enter().append('g')
      .attr({
        'class': 'node'
      })
    .call(this.force.drag);

    if (nodeGroup.selectAll('circle').empty()) {
      var circle = nodeGroup.append('circle')
        .attr({
          r: function(d) {
            return d.r;
          }
        })
        .style({
          fill: function(d) {
            return d.color;
          }
        });

      let label = nodeGroup.append('text')
        .attr({
          x: 0,
          y: 3,
        })
        .text(function(d) {
          return d.id;
        })
        .style({
          fill: 'white',
          'font-weight': 'bold',
          'font-size': '12px'
        });


      this.force.nodes(nodes).start();

      } else {
      let circle = nodeGroup.selectAll('circle');
      circle.transition()
        .duration(800)
        .attr({
          r: function (d) {
            return d.r;
          }
        })
        .style({
          fill: function(d) {
            return d.color;
          }
        });

      let nodeMap = {};

      setTimeout(() => {
        nodeGroup.each(collide(.1, nodes, this.scales.r))
          .attr({
            transform: function (d, i) {
              nodeMap[d.id] = {x: d.x, y: d.y};
              return 'translate(' + d.x + ',' + d.y + ')';
            },
          });

        // update nodes
        for (let i = 0; i < this.state.nodes.length; i++){
          let node = this.state.nodes[i];
          let newSettings = nodeMap[node.id];
          node.x = newSettings.x;
          node.y = newSettings.y;
        }

        this.force.start();
      }, 300);
    }
      nodeGroup.exit().remove();
    };

  _getRadius(dataObj, scales){

    return scales.r(Math.abs(dataObj.baseTradedAmount));
  }


  componentDidMount() {
    setTimeout(this.createChartForce.bind(this), 1000);
  };

  componentWillReceiveProps(nextProps){
    if (this.state.nodes){
      this._isUpdateRequired();
    }
  }

  componentDidUpdate(){
    console.log(' COMPONENT DID UPDATE');
    if (!this.props.data) return;
    if ( !this.state.nodes || !this.force) return;
    if (this.state.nodes){
      this._update(this.state.nodes);
    }
  }

  render(){
    return (
      <div style={{'textAnchor': 'middle', 'color': 'white'}}>
      </div>
    );
  }
}

