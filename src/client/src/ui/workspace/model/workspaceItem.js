import React from 'react';

export default class WorkspaceItem {
  key:string;
  modelId:string;
  view:React.Component;

  constructor(key:string, modelId:string,view:React.Component) {
      this.key = key;
      this.modelId = modelId;
      this.view = view;
  }
}
