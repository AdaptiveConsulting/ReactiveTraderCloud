import React from 'react';

export default class WorkspaceItem {
  key:String;
  modelId:String;
  view:React.Component;

  constructor(key:String, modelId:String,view:React.Component) {
      this.key = key;
      this.modelId = modelId;
      this.view = view;
  }
}
