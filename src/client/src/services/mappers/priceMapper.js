import { SpotPrice } from '../model';

export default class PriceMapper {
  mapFromSpotPriceDto(dto:Object) : SpotPrice {

    return new SpotPrice(
      dto.Symbol,
      Number(dto.Bid),
      Number(dto.Ask),
      Number(dto.Mid),
      dto.ValueDate,
      dto.CreationTimestamp
    );
  }

  getSpread(sell:number, buy:number){
    const { pip, precision } = this.props;
    return sell != null ? ((sell - buy) * Math.pow(10, pip)).toFixed(precision - pip) : '';
  }


}
