import React from 'react';
import { Guard } from '../../system';
import { ModelBase, ViewBase } from '../common';

let DEFAULT_VIEW_KEY = 'default-view-key';

function getMetadata(target) : ViewMetadata {
  if (!target._viewMetadata) {
    target._viewMetadata = new ViewMetadata();
  }
  return target._viewMetadata;
}

export function createViewForModel(model:ModelBase, displayContext:string = DEFAULT_VIEW_KEY) : React.Component {
  // the view decorator isn't on the instance, it's on the constructor function that created that instance
  var constructorFunction = model.constructor;
  if (constructorFunction._viewMetadata) {
    let viewMetadata:ViewMetadata = constructorFunction._viewMetadata;
    if(viewMetadata.hasRegisteredViewContext(displayContext)) {
      let viewRegistration : ViewMetadataRegistration = viewMetadata.viewRegistrations[displayContext];
      return React.createElement(viewRegistration.view, {modelId: model.modelId});
    }
  }
  throw new Error(`No suitable view found for model using '${displayContext}' context `);
}

/**
 * An ES7 style decorator that associates a model with a view
 * @param view the react component that will be used to display this model
 * @param displayContext an optional context allowing for different views to display the same model
 * @returns {Function}
 */
export function view(view:ViewBase, displayContext:string = DEFAULT_VIEW_KEY) {
  Guard.isDefined(view, 'view must be defined');
  Guard.isString(displayContext, 'displayContext must be a string');
  return function (target, name, descriptor) {
    let metadata : ViewMetadata = getMetadata(target);
    if (metadata.hasRegisteredViewContext(displayContext)) {
      throw new Error(`Context ${displayContext} already registered for view`);
    }
    metadata.viewRegistrations[displayContext] = new ViewMetadataRegistration(view, displayContext);
    return descriptor;
  };
}

class ViewMetadata {
  _viewRegistrations:{ [context: string] : ViewMetadataRegistration };

  constructor() {
    this._viewRegistrations = {};
  }

  get viewRegistrations(): { [context: string] : ViewMetadataRegistration } {
    return this._viewRegistrations;
  }

  hasRegisteredViewContext(displayContext:string) {
    return typeof this._viewRegistrations[displayContext] !== 'undefined';
  }
}

class ViewMetadataRegistration {
  _view:ViewBase;
  _displayContext:string;

  constructor(view:ViewBase, context:string) {
    this._view = view;
    this._displayContext = context;
  }

  get view():ViewBase {
    return this._view;
  }

  get displayContext():string {
    return this._displayContext;
  }
}

