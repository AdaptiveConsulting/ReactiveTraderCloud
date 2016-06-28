import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import d3tip from 'd3-tip';
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


  _shouldRedrawChart(){
    let positionsData = getPositionsDataFromSeries(this.props);
    let existingPositionsData = this.state.prevPositionsData;
    let nodesChanged = positionsData.length !== existingPositionsData.length;

    if (nodesChanged){
      this.setState({updateRequired: true});
    }
    return nodesChanged;
  }

  _isUpdateRequired(){
    let positionsData = getPositionsDataFromSeries(this.props);
    let existingPositionsData = this.state.prevPositionsData;

    //positions data has changed on the existing nodes
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

    let colours = ['#6db910', 'gray', '#d90a0a'];

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

  redrawChart(){
    let dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');
    svg.remove();
    this.createChartForce();
    this.setState({updateRequired: true});
  }


  createChartForce(){
    this.setState({nodes: []});
    let dom = ReactDOM.findDOMNode(this);
    this.scales = createScales(this.props);

    const tick = (e)=> {
      let nodeGroup = svg.selectAll('g.node')
        .on('mouseover', (d) => { console.log('mouse over d, ', d); this._mouseOverHandler(d);} )
        .on('mousemove', (d) => { console.log('mouse MOVE d, ', d); this._mouseOverHandler(d);} )
        .on('mouseout', (d) => this._mouseOutHandler(d));
        /*.on('mouseover', this.tooltipGroup.show)
        .on('mouseout', this.tooltipGroup.hide);*/
      updateNodes(nodeGroup, this.state.nodes, this.scales);
    };

    let svg = d3.select(dom).append('svg')
      .attr({
        width: this.props.width,
        height: this.props.height
      });


    this.tooltipGroup = d3tip().attr('class', 'analytics__positions-tooltip').direction('s').offset([0, 0]).html(function(d){
      return 'some string';
    });

    svg.call(this.tooltipGroup);

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
    if (!nodes) return;
    if (!this.state.updateRequired) return;
    this.setState({updateRequired: false});

    let dom = ReactDOM.findDOMNode(this);
    let svg = d3.select(dom).select('svg');

    let nodeGroup = svg.selectAll('g.node')
      .data(nodes, function(d, i) {
        return d.id;
      })
      .on('mouseover', (d) => { console.log('mouse over d, ', d); this._mouseOverHandler(d);} )
      .on('mousemove', (d) => { console.log('mouse MOVE d, ', d); this._mouseOverHandler(d);} )
      .on('mouseout', (d) => this._mouseOutHandler(d));
    
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

  _mouseOverHandler(node){
    console.log('node : ', node);
    this.tooltipGroup.show();
  };

  _mouseOutHandler(node){
    this.tooltipGroup.hide();
  };

  _getRadius(dataObj, scales){
    return scales.r(Math.abs(dataObj.baseTradedAmount));
  }


  componentDidMount() {
    setTimeout(this.redrawChart.bind(this), 1000);
  };

  componentWillReceiveProps(nextProps){
    if (this.state.nodes){

      if (this._shouldRedrawChart()){
        this.redrawChart();
      }
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
    console.log(' *** render called -- ');
    return (
      <div className='analytics__bubblechart-container'>
      </div>
    );
  }
}

