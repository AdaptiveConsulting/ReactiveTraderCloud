import { Observable } from 'rxjs/Rx';
import { Router } from 'esp-js';
import { Guard } from '../';

/**
 * Helper method to ease integration between Rx and Esp.
 *
 * When receiving results from an async operation (for example when results yield on an rx stream) you need to notify the esp router that a state change is about to occur for a given model.
 * There are a few ways to do this:
 * 1) publish an esp event in your rx subscription handler, handle the esp event as normal (the publish will have kicked off the the routers dispatch loop).
 * 2) call router.runAction() in your subscription handler and deal with the results inline, again this kicks off the the routers dispatch loop.
 * 3) use subscribeWithRouter which effectively wraps up method 2 for for all functions of subscribe (next, error, complete).
 *
 * @param router
 * @param modelId : the model id you want to update
 * @param next
 * @param error
 * @param complete
 */
Observable.prototype.subscribeWithRouter = function(
  router,
  modelId,
  next,
  error,
  complete) {

  Guard.isDefined(router, 'router should be defined');
  Guard.isString(modelId, 'modelId should be defined and a string');
  let source = this;

  return source.materialize().subscribe(i =>
  {
    switch (i.kind) {
      case 'N':
        if(next !== null && next !== undefined) {
          router.runAction(modelId, model => next(i.value, model));
        }
        break;
      case 'E':
        if(error === null || error === undefined) {
          throw i.error;
        } else {
          router.runAction(modelId, model => error(i.error, model));
        }
        break;
      case 'C':
        if(complete !== null && complete !== undefined) {
          router.runAction(modelId, model => complete(model));
        }
        break;
      default:
        throw new Error(`Unknown Notification Type. Type was ${i.kind}`);
    }
  });
};
