import React from 'react';

export default class PopoutRegistration {
  private _view:React.Component;
  private _modelId:string;

  constructor(view:React.Component, modelId:string) {
    this._view = view;
    this._modelId = modelId;
  }

  get view():React.Component {
    return this._view;
  }

  get modelId():string {
    return this._modelId;
  }
}
