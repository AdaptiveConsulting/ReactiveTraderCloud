import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { logger } from '../../../system';

import './spotTileView.scss';

var _log:logger.Logger = logger.create('SpotTileView');

class SpotTileView extends ViewBase {

  render() {
    return (<h1>spot tile</h1>);
  }
}

export default SpotTileView;
