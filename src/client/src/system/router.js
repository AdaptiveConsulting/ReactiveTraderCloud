import logger from './logger';
import espDevTools from 'esp-js-devtools';
espDevTools.registerDevTools();

var _log:logger.Logger = logger.create('UnhandledModelError');

import { Router } from 'esp-js/src';
// The application uses a single esp router.
// Views can take the router instance it via import/require, however for model entities it's best not to rely on sourcing instance style objects from import/require.
// This is because it makes the code a little less flexable, less portable and a little more magic.
// I tend to think of anything 'imported' as a static object, hard to test these.
// Typically you don't test the jsx/view and you don't really have any other options to get them the router.
// This is because they are created on a very different code path (i.e. via React `render`) and it's a bit over kill to pass it via props (using the React context could be an alternative).
let router = new Router();
router.addOnErrorHandler(err => _log.error(`Unhandled error in model`, err));
export default router;
