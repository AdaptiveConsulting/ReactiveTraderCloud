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
}
