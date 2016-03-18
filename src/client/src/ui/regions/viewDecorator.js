import React from 'react';
import { Guard } from '../../system';
import { ModelBase, ViewBase } from '../common';

let DEFAULT_CONTEXT = 'default';

function getMetadata(target) : ViewMetadata {
  if (!target._viewMetadata) {
    target._viewMetadata = new ViewMetadata();
  }
  return target._viewMetadata;
}

export function createViewForModel(model:ModelBase, context:string = DEFAULT_CONTEXT) : React.Component {
  // the view decorator isn't on the instance, it's on the constructor function that created that instance
  var constructorFunction = model.constructor;
  if (constructorFunction._viewMetadata) {
    let viewMetadata:ViewMetadata = constructorFunction._viewMetadata;
    if(viewMetadata.hasRegisteredViewContext(context)) {
      let viewRegistration : ViewMetadataRegistration = viewMetadata.viewRegistrations[context];
      return React.createElement(viewRegistration.view, {modelId: model.modelId});
    }
  }
  throw new Error(`No suitable view found for model using '${context}' context `);
}

/**
 * An ES7 style decorator that associates a model with a view
 * @param view the react component that will be used to display this model
 * @param context an optional context allowing for different views to display the same model
 * @returns {Function}
 */
export function view(view:ViewBase, context:string = DEFAULT_CONTEXT) {
  Guard.isDefined(view, 'view must be defined');
  Guard.isString(context, 'context must be a string');
  return function (target, name, descriptor) {
    let metadata : ViewMetadata = getMetadata(target);
    if (metadata.hasRegisteredViewContext(context)) {
      throw new Error(`Context ${context} already registered for view`);
    }
    metadata.viewRegistrations[context] = new ViewMetadataRegistration(view, context);
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

  hasRegisteredViewContext(context:string) {
    return typeof this._viewRegistrations[context] !== 'undefined';
  }
}

class ViewMetadataRegistration {
  _view:ViewBase;
  _context:string;

  constructor(view:ViewBase, context:string) {
    this._view = view;
    this._context = context;
  }

  get view():ViewBase {
    return this._view;
  }

  get context():string {
    return this._context;
  }
}

