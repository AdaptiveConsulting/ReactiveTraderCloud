import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import { createScales, getPositionsDataFromSeries, updateNodes, drawCircles, drawLabels } from './chartUtil';

export default class PositionsBubbleChart extends React.Component{

  static propTypes = {
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


    if (diffData.length > 0){
      this.setState({prevPositionsData: positionsData, updateRequired: true});
      this.scales = createScales(this.props);
      this._updateNodes();
    }

    return diffData.length > 0;
  }

  _updateNodes(){
    let nodes = this.state.nodes;

    let colours = ['green', 'gray', 'red'];

    let positionsData = getPositionsDataFromSeries(this.props);

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
          r: colorIndex === 1 ? 20 : this._getRadius(dataObj, this.scales),
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
    this.scales = createScales(this.props);

    const tick = (e)=> {
      let nodeGroup = svg.selectAll('g.node');
      updateNodes(nodeGroup, this.state.nodes, this.scales);
    };

    let svg = d3.select(dom).append('svg')
      .attr({
        width: this.props.width,
        height: this.props.height
      });

    this.force = d3.layout.force()
        .nodes(this.state.nodes)
        .links([])
        .size([this.props.width, this.props.height])
        .charge(function(d) {
          return -1 ;//return -1 * (Math.pow(d.r * 5.0, 2.0) / 8);
        })
        .gravity(0.1)//(2.75)
        .on('tick', tick);


    this._update(this.state.nodes);
  }

  _update(nodes){


    console.log(' _update, update required : ', this.state.updateRequired);
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
      let circleNodeGroup = nodeGroup.append('circle');
      let labelGroup = nodeGroup.append('text');
      drawCircles(circleNodeGroup, 0);
      drawLabels(labelGroup);
      this.force.nodes(nodes).start();

    } else {
      let circle = nodeGroup.selectAll('circle');
      drawCircles(circle);

      setTimeout(() => {
        updateNodes(nodeGroup, this.state.nodes, this.scales);
        this.force.start();
      }, 200);
      nodeGroup.exit().remove();
    }
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

