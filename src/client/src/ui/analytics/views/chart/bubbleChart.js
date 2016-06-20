import d3 from 'd3';
import EventEmitter from 'events';

const ANIMATION_DURATION = 400;
const TOOLTIP_WIDTH = 30;
const TOOLTIP_HEIGHT = 30;

export default class BubbleChart{

  create(element, props, state){
    var svg = d3.select(element).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

    svg.append('g')
      .attr('class', 'd3-points');

    var dispatcher = new EventEmitter();
    this.update(element, state, dispatcher);

    return dispatcher;
  }

  update(element, state, dispatcher){
    var scales = this._scales(element, state.domain);
    var prevScales = this._scales(element, state.prevDomain);
    this._drawPoints(element, scales, state.data, prevScales, dispatcher);
    //this._drawTooltips(el, scales, state.tooltips, prevScales);
  }

  destroy(){}

  _scales(element, domain) {
    if (!domain) {
      return null;
    }

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    var x = d3.scale.linear()
      .range([0, width])
      .domain(domain.x);

    var y = d3.scale.linear()
      .range([height, 0])
      .domain(domain.y);

    var z = d3.scale.linear()
      .range([5, 20])
      .domain([1, 10]);

    return {x: x, y: y, z: z};
  };

  _drawPoints(element, scales, data, prevScales, dispatcher){
    var g = d3.select(element).selectAll('.d3-points');

    var point = g.selectAll('.d3-point')
      .data(data, function(d) { return d.id; });

    point.enter().append('circle')
      .attr('class', 'd3-point')
      .attr('cx', function(d) {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); });

    point.attr('cy', function(d) { return scales.y(d.y); })
      .attr('r', function(d) { return scales.z(d.z); })
      .on('mouseover', function(d) {
        dispatcher.emit('point:mouseover', d);
      })
      .on('mouseout', function(d) {
        dispatcher.emit('point:mouseout', d);
      })
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); });

    if (prevScales) {
      point.exit()
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) { return scales.x(d.x); })
        .remove();
    }
    else {
      point.exit()
        .remove();
    }
  }
}
