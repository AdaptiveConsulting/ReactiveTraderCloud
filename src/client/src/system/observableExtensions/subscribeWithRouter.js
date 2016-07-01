import Rx from 'rx';
import { Router } from 'esp-js/src';
import { Guard } from '../';

/**
 * Helper method to ease integration between Rx and Esp.
 *
 * When receiving results from an async operation (for example when results yield on an rx stream) you need to notify the esp router that a state change is about to occur for a given model.
 * There are a few ways to do this:
 * 1) publish an esp event in your rx subscription handler, handle the esp event as normal (the publish will have kicked off the the routers dispatch loop).
 * 2) call router.runAction() in your subscription handler and deal with the results inline, again this kicks off the the routers dispatch loop.
 * 3) use subscribeWithRouter which effectively wraps up method 2 for for all functions of subscribe (onNext, onError, onCompleted).
 *
 * @param router
 * @param modelId : the model id you want to update
 * @param onNext
 * @param onError
 * @param onCompleted
 */
Rx.Observable.prototype.subscribeWithRouter = function<T, TModel>(
  router : Router,
  modelId: String,
  onNext?: (value: T, model : TModel) => void,
  onError?: (exception: any, model : TModel) => void,
  onCompleted?: (model : TModel) => void) : Rx.Disposable {

  Guard.isDefined(router, 'router should be defined');
  Guard.isString(modelId, 'modelId should be defined and a string');
  let source = this;

  return source.materialize().subscribe(i =>
  {
    switch (i.kind) {
      case 'N':
        if(onNext !== null && onNext !== undefined) {
          router.runAction(modelId, model => onNext(i.value, model));
        }
        break;
      case 'E':
        if(onError === null || onError === undefined) {
          throw i.error;
        } else {
          router.runAction(modelId, model => onError(i.error, model));
        }
        break;
      case 'C':
        if(onCompleted !== null && onCompleted !== undefined) {
          router.runAction(modelId, model => onCompleted(model));
        }
        break;
      default:
        throw new Error(`Unknown Notification Type. Type was ${i.kind}`);
    }
  });
};
