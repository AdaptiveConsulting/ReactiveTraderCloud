import React from 'react';
import { CompositeDisposable } from 'esp-js';
import { router } from '../../system';
import './styles/_base.scss';
import './styles/_fonts.scss';

export default class ViewBase extends React.Component {
  _disposables:CompositeDisposable;
  _isObservingModel:boolean;

  static propTypes = {
    modelId: React.PropTypes.string
  }

  constructor() {
    super();
    this._disposables = new CompositeDisposable();
    this._isObservingModel = false;
  }

  componentWillReceiveProps() {
    this._tryObserveModel();
  }

  componentWillMount() {
    this._tryObserveModel();
  }

  componentWillUnmount() {
    this._disposables.dispose();
  }

  _tryObserveModel() {
    let modelId = this.props.modelId || this.state.modelId;
    if (!this._isObservingModel && modelId) {
      this._isObservingModel = true;
      this._disposables.add(
        router.getModelObservable(modelId).subscribe(model => {
          this.setState({model: model});
        })
      );
    }
  }
}
