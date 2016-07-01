import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import Dimensions from 'react-dimensions';
import { logger } from '../../../../system';
import {  createScales,
          getPositionsDataFromSeries,
          updateNodes,
          drawCircles,
          drawLabels,
          getRadius,
          getPositionValue} from './chartUtil';

const _log:logger.Logger = logger.create('PositionsBubbleChart');

@Dimensions()
export default class PositionsBubbleChart extends React.Component{

  static propTypes = {
    data: React.PropTypes.array,
    containerWidth: React.PropTypes.number,
    containerHeight: React.PropTypes.number
  };

  static defaultProps = {
    data: []
  };

  constructor(props){
    super(props);
    this.state = {
      nodes: [],
      prevPositionsData: {}
    };
  }

  componentDidMount() {
    this._redrawChart();
  };

  componentWillReceiveProps(nextProps){
    this._updateNodesFromPropsData(nextProps);

    if (this._shouldRedrawChart(nextProps)){
      this.setState({updateRequired: true});
      this._redrawChart(nextProps);
    }
  }

  componentDidUpdate(){
    this._update(this.state.nodes);
  }

  _shouldRedrawChart(nextProps = this.props){
    let positionsData = getPositionsDataFromSeries(nextProps.data);
    let existingPositionsData = this.state.prevPositionsData;
    let nodesChanged = positionsData.length !== existingPositionsData.length;
    return nodesChanged;
  }

  _updateNodesFromPropsData(nextProps = this.props){
    if (this.state.nodes.length === 0 && nextProps.data.length > 0){
      this._updateNodes(nextProps.data);
    }
    let positionsData = getPositionsDataFromSeries(nextProps.data);
    let existingPositionsData = this.state.prevPositionsData;

    //positions data has changed on the existing nodes
    let modifiedData = _.reduce(positionsData, (result, value, key) => {
      return _.isEqual(value, existingPositionsData[key]) ?
        result : result.concat(key);
    }, []);

    let stalePositions = _.filter(existingPositionsData, (existingPos) => _.findIndex(positionsData, (pos) => pos.symbol === existingPos.symbol) === -1);

    if (modifiedData.length > 0 || stalePositions.length > 0){
      this.setState({prevPositionsData: positionsData, updateRequired: true});
      this.scales = createScales(nextProps);

      if (this.state.nodes.length === 0 && this.props.data > 0){
        this._updateNodes(this.props.data);
      }else{
        this._updateNodes(nextProps.data);
      }
    }

    return modifiedData.length > 0 || stalePositions.length > 0;
  }

  _updateNodes(data){
    let nodes = this.state.nodes;
    let colours = ['#6db910', '#d90a0a'];
    let positionsData = getPositionsDataFromSeries(data);

    nodes = _.map(positionsData, (dataObj, index) => {
      let color =  dataObj.baseTradedAmount > 0 ? colours[0] : colours[1];

      //update an existing node:
      let existingNode = _.find(nodes, (node) => node.id === dataObj.symbol);
      if (existingNode){
        existingNode.r = getRadius(dataObj, this.scales);
        existingNode.cx = this.scales.x(index);
        existingNode.color = color;
        return existingNode;
      }else{
        let newNode = {
          id: dataObj.symbol,
          r: getRadius(dataObj, this.scales),
          cx: this.scales.x(index),
          color: color
        };
        return newNode;
      }
    });

    let updatedNodes = _.filter(nodes, (node) => _.findIndex(positionsData, (pos) => pos.symbol === node.id) !== -1);
    this.setState({nodes: updatedNodes, prevPositionsData: positionsData, updateRequired: true});
  }

  _redrawChart(nextProps = this.props){
    let dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');
    svg.remove(); //clear all child nodes
    this.setState({updateRequired: true});

    this._createTooltip();
    this._createChartForce(nextProps);
  }

  _createTooltip(){
    if (this.tooltip) return;
    let dom = ReactDOM.findDOMNode(this);
    this.tooltip = d3.select(dom)
      .append('div')
      .style('visibility', 'hidden')
      .attr('class', 'analytics__positions-tooltip');
  }

  _createChartForce(nextProps = this.props){
    let dom = ReactDOM.findDOMNode(this);
    this.scales = createScales(nextProps);

    const tick = (e) => {
      let nodeGroup = svg.selectAll('g.node')
        .on('mouseover', (dataObj) => { this.tooltip.style('visibility', 'visible'); this._positionTooltip(dataObj); })
        .on('mousemove', this._positionTooltip.bind(this))
        .on('mouseout',  () => this.tooltip.style('visibility', 'hidden'));

      updateNodes(nodeGroup, this.state.nodes, this.scales);
    };

    let svg = d3.select(dom).append('svg')
      .attr({
        width: this.props.containerWidth,
        height: this.props.containerHeight
      });

    this.force = d3.layout.force()
        .nodes(this.state.nodes)
        .links([])
        .size([this.props.containerWidth, this.props.containerHeight])
        .charge((d) => {
          return -1 ;
        })
        .gravity(0.1)
        .on('tick', tick);

    this._update(this.state.nodes);
  }

  _positionTooltip(dataObj){
    let posX = ( event ? event.layerX : dataObj.x) - this.tooltip[0][0].clientWidth/2;
    let posY = event ? event.layerY : dataObj.y;
    this.tooltip.style('top', (posY + 15)+'px').style('left', posX + 'px');
    this.tooltip.text(`${dataObj.id} ${getPositionValue(dataObj.id, this.state.prevPositionsData)}`);
  }

  _update(nodes){
    if (!nodes || !this.force) return;
    if (!this.state.updateRequired) return;
    this.setState({updateRequired: false});

    let dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');

    let nodeGroup = svg.selectAll('g.node')
      .data(nodes, (d, i) => {
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

    }
    nodeGroup.exit().remove();
  };

  render(){
    return (
      <div className='analytics__bubblechart-container'>
      </div>
    );
  }
}

