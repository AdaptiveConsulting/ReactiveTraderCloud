import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { HeaderModel } from '../model';
import './header.scss';

export default class HeaderView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    }
  }

  render() {
    let model:HeaderModel = this.state.model;
    if (!model) {
      return null;
    }

    return (
      <nav className='header chrome-controls'>
        <ul className='header__controls'>
          <li className='header__control_item'>
            <a title='Minimise'
               onClick={(e) => router.publishEvent(this.props.modelId, 'minimiseClicked', e)}
               href='#'>
              <i className='header__icon--minimise fa fa-minus-square'/>
            </a>
          </li>
          <li className='header__control_item'>
            <a title='Maximise'
               onClick={(e) => router.publishEvent(this.props.modelId, 'maximiseClicked', e)}
               href='#'>
              <i className='header__icon--maximise fa fa-plus-square'/>
            </a>
          </li>
          <li className='header__control_item'>
            <a title='Close'
               onClick={(e) => router.publishEvent(this.props.modelId, 'closeClicked', e)}
               href='#'>
              <i className='header__icon--close fa fa-times'/>
            </a>
          </li>
        </ul>
      </nav>
    );
  }

}
