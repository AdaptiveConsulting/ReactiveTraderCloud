import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import d3tip from 'd3-tip';
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
    if (this._shouldRedrawChart(nextProps)){
      this.setState({updateRequired: true});
      this._redrawChart(nextProps);
    }
    this._isPropsDataModified(nextProps);
  }

  componentDidUpdate(){
    this._update(this.state.nodes);
  }

  _shouldRedrawChart(nextProps = this.props){

    if (this.state.nodes.length === 0 && nextProps.data.length > 0){
      this._updateNodes(nextProps.data);
    }

    let positionsData = getPositionsDataFromSeries(nextProps.data);
    let existingPositionsData = this.state.prevPositionsData;
    let nodesChanged = positionsData.length !== existingPositionsData.length;

    return nodesChanged;
  }

  _isPropsDataModified(nextProps = this.props){
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

      if (this.state.nodes.length === 0){
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
        nodes.push(newNode);
        return newNode;
      }
    });

    let updatedNodes = _.filter(this.state.nodes, (node) => _.findIndex(positionsData, (pos) => pos.symbol === node.id) !== -1);
    this.setState({nodes: updatedNodes, prevPositionsData: positionsData, updateRequired: true});
  }

  _redrawChart(nextProps = this.props){
    let dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');
    svg.remove(); //clear all child nodes
    if (this.tooltipGroup) this.tooltipGroup.hide();
    this.setState({updateRequired: true});
    this._createChartForce(nextProps);
  }

  _createChartForce(nextProps = this.props){
    let dom = ReactDOM.findDOMNode(this);
    this.scales = createScales(nextProps);

    const tick = (e) => {
      let nodeGroup = svg.selectAll('g.node')
        .on('mouseover', this.tooltipGroup.show )
        .on('mousemove', this.tooltipGroup.show )
        .on('mouseout',  this.tooltipGroup.hide );

      updateNodes(nodeGroup, this.state.nodes, this.scales);
    };

    let svg = d3.select(dom).append('svg')
      .attr({
        width: this.props.containerWidth,
        height: this.props.containerHeight
      });

    this.tooltipGroup = d3tip().html((d)=>{
      return `${d.id} ${getPositionValue(d.id, this.state.prevPositionsData)}` ;
    })
      .attr('class', 'analytics__positions-tooltip').direction('s').offset([-5, 0]);

    svg.call(this.tooltipGroup);

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

