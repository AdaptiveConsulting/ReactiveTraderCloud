import _ from 'lodash';

/**
 * @class Traders
 * @description quick way to assign a random username
 */
class Traders {
  static list = [{
    shortCode: 'LMO',
    firstName: 'Lorretta',
    lastName: 'Moe'
  }, {
    shortCode: 'WMO',
    firstName: 'Wenona',
    lastName: 'Moshier'
  }, {
    shortCode: 'NGA',
    firstName: 'Nita',
    lastName: 'Garica'
  }, {
    shortCode: 'HHA',
    firstName: 'Hyun',
    lastName: 'Havlik'
  }, {
    shortCode: 'EDO',
    firstName: 'Elizebeth',
    lastName: 'Doverspike'
  }, {
    shortCode: 'MDA',
    firstName: 'Magali',
    lastName: 'Dash'
  }, {
    shortCode: 'DGR',
    firstName: 'Dorinda',
    lastName: 'Granillo'
  }, {
    shortCode: 'JMC',
    firstName: 'Jade',
    lastName: 'Mccollister'
  }, {
    shortCode: 'MPE',
    firstName: 'Michiko',
    lastName: 'Perl'
  }, {
    shortCode: 'CZA',
    firstName: 'Chanda',
    lastName: 'Zager'
  }, {
    shortCode: 'JED',
    firstName: 'Jarrett',
    lastName: 'Eddings'
  }, {
    shortCode: 'HLU',
    firstName: 'Harley',
    lastName: 'Luther'
  }, {
    shortCode: 'DOR',
    firstName: 'Dong',
    lastName: 'Ortega'
  }, {
    shortCode: 'KLA',
    firstName: 'King',
    lastName: 'Lamb'
  }, {
    shortCode: 'AZE',
    firstName: 'Andres',
    lastName: 'Zebrowski'
  }, {
    shortCode: 'RNI',
    firstName: 'Rufus',
    lastName: 'Nilges'
  }, {
    shortCode: 'FAP',
    firstName: 'Fritz',
    lastName: 'Aparicio'
  }, {
    shortCode: 'DNA',
    firstName: 'Don',
    lastName: 'Nason'
  }, {
    shortCode: 'ESP',
    firstName: 'Eldridge',
    lastName: 'Spoor'
  }, {
    shortCode: 'AGE',
    firstName: 'Ambrose',
    lastName: 'Gerdts'
  }]

  /**
   * @constructs Trader
   * @param trader
   */
  constructor(trader){
    this.setTrader(trader);
  }

  /**
   * Sets the current trader to their short code or picks a random one.
   * @param {String=} traderCode
   */
  setTrader(traderCode:string){
    let trader;

    if (traderCode){
      trader = _.findWhere(Traders.list, {
        shortCode: traderCode
      });
    }

    if (!trader){
      trader = _.sample(Traders.list);
    }

    this.name = trader.firstName;
    this.surname = trader.lastName;
    this.code = trader.shortCode;
  }
}

export default new Traders;
