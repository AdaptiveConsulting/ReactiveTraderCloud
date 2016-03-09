import React from 'react';
import { Router, CompositeDisposable } from 'esp-js/src';
import { router } from '../../system';

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
    if (!this._isObservingModel && this.props.modelId) {
      this._isObservingModel = true;
      this._disposables.add(
        router.getModelObservable(this.props.modelId).observe(model => {
          this.setState({model: model});
        })
      );
    }
  }
}
