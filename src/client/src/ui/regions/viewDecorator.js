import React from 'react';
import { Guard } from '../../system';
import { ModelBase } from '../common';

let DEFAULT_CONTEXT = 'default';

function trySetMetadata(target) {
  if (!target._viewMetadata) {
    target._viewMetadata = {
      viewRegistrations: {}
    };
  }
}

export function createViewForModel(model:ModelBase, context:string = DEFAULT_CONTEXT):React.Component {
  if (model._viewMetadata && model._viewMetadata[context]) {
    var viewComponent = model._viewMetadata[context];
    return React.createElement(viewComponent, {modelId: model.modelId});
  }
  throw new Error(`No suitable view found for model using '${context}' context `);
}

/**
 * An ES7 style decorator that associates a model with a view
 * @param view the react component that will be used to display this model
 * @param context an optional context allowing for different views to display the same model
 * @returns {Function}
 */
export function view(view:React.Component, context:string = DEFAULT_CONTEXT) {
  Guard.isDefined(view, 'view must be defined');
  Guard.isString(context, 'context must be a string');
  return function (target, name, descriptor) {
    trySetMetadata(target);
    if (typeof target._viewMetadata[context] !== 'undefined') {
      throw new Error(`Context ${context} already registered for view`);
    }
    target._viewMetadata.viewRegistrations[context] = {
      view: view,
      content: context
    };
    return descriptor;
  };
}
