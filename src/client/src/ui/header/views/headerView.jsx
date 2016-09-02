import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { HeaderModel } from '../model';
import './header.scss';

export default class HeaderView extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
  }

  render() {
    let model:HeaderModel = this.props.model;
    let router = this.props.router;
    return (
      <nav className='header chrome-controls'>
        <ul className='header__controls'>
          <li className='header__control'>
            <a title='Minimise'
               onClick={(e) => router.publishEvent(model.modelId, 'minimiseClicked', e)}
               href='#'>
              <i className='header__icon--minimise fa fa-minus-square'/>
            </a>
          </li>
          <li className='header__control'>
            <a title='Maximise'
               onClick={(e) => router.publishEvent(model.modelId, 'maximiseClicked', e)}
               href='#'>
              <i className='header__icon--maximise fa fa-plus-square'/>
            </a>
          </li>
          <li className='header__control'>
            <a title='Close'
               onClick={(e) => router.publishEvent(model.modelId, 'closeClicked', e)}
               href='#'>
              <i className='header__icon--close fa fa-times'/>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
