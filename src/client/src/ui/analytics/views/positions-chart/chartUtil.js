import _ from 'lodash';
import d3 from 'd3';
import {  CurrencyPairPosition } from '../../../../services/model';

export function createScales(props){
  let ratio = 12.5;
  let width = props.width;
  let height = props.height;
  let numNodes = props.numNodes;
  let minR = 14;
  let maxR = 100;
  let offset = maxR / 2;
  let horK = 1;

  let baseVals = _.map(props.data, (val) => Math.abs(val[CurrencyPairPosition.baseTradedAmountName]));

  let maxVal = _.max(baseVals);
  let minVal = 0;//_.min(baseVals);
  let scales = {
    x: d3.scale.linear()
      .domain([0, numNodes])
      .range([((width/ratio - 20))*-1, (width-offset)/ratio]),
    colorX: d3.scale.linear()
      .domain([0, 3])
      .range([0, (width-offset)]),
    colorY: d3.scale.linear()
      .domain([0, 3])
      .range([height/(ratio * horK*2)*-1, height/(ratio * horK)]),
    y: d3.scale.linear()
      .domain([0, numNodes])
      .range([(height/(ratio * horK*2) )*-1, height/(ratio * horK) ]),
    r: d3.scale.sqrt()
      .domain([minVal, maxVal])
      .range([minR, maxR])
  };
  return scales;
}


export function getPositionsDataFromSeries(props):Array<{symbol:string, baseAmount:number}>{
  let baseAmtPropName = CurrencyPairPosition.baseTradedAmountName;
  let positionsPerCcyObj = props.data.reduce((aggregatedPositionsObj, ccyPairPosition) => {

    //aggregate amount per ccy;
    let baseCurrency = ccyPairPosition.currencyPair.base;
    aggregatedPositionsObj[baseCurrency] = aggregatedPositionsObj[baseCurrency]
      ? aggregatedPositionsObj[baseCurrency] + ccyPairPosition[baseAmtPropName] : ccyPairPosition[baseAmtPropName];

    return aggregatedPositionsObj;
  }, {});

//map the object to the array of ccy-amount pairs and exclude 0 base amount
return _.map(positionsPerCcyObj, (val, key) => {
  return {symbol: key, [baseAmtPropName]: val};
}).filter((positionPerCcy, index) => positionPerCcy[baseAmtPropName] !== 0);
}

export function collide(alpha, nodes, scale) {
  let quadtree = d3.geom.quadtree(nodes);
  let padding = 10;

  return function(d) {
    let r = d.r + 10 + padding;//d.r + scale.domain()[1] + padding;

    let nx1 = d.x - r;
    let nx2 = d.x + r;
    let ny1 = d.y - r;
    let ny2 = d.y + r;

    return quadtree.visit(function(quad, x1, y1, x2, y2) {
      var l, x, y;
      if (quad.point && quad.point !== d) {
        x = d.x - quad.point.x;
        y = d.y - quad.point.y;
        l = Math.sqrt(x * x + y * y);
        r = d.r + quad.point.r + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;

        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
};
