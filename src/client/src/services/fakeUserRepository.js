import * as model from './model';

var fakeUserDetails = [{
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
}];

var userDetails = _.sample(fakeUserDetails);
var currentUser = new model.User(userDetails.firstName, userDetails.lastName, userDetails.shortCode);

export default class FakeUserRepository {
  /**
   * A hardcoded current users that gets set on app start up.
   */
  static get currentUser() {
    return currentUser;
  }
}
