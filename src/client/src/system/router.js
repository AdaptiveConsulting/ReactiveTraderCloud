import logger from './logger';
import { Router } from 'esp-js';

// esp dev tools is in beta ATM, bit heavy on the performance side of things.
// However feel free to uncomment these 2 lines and check it out.
// ctrl+alt+d brings up the tool window
//import espDevTools from 'esp-js-devtools';
//espDevTools.registerDevTools();

var _log:logger.Logger = logger.create('UnhandledModelError');

// The application uses a single esp router.
// Views can take the router instance it via import/require, however for model entities it's best not to rely on sourcing 'instance' style objects from import/require.
// This is because it makes the code a little less flexable, less portable and a little more magic.
// I tend to think of anything 'imported' as a static object, hard to test these.
// Typically you don't test the jsx/view and you don't really have any other options to get them the router.
// This is because they are created on a very different code path (i.e. via React `render`) and it's a bit over kill to pass the router via props (using the React context could be an alternative).
let router = new Router();
router.addOnErrorHandler(err => {
  _log.error('Unhandled error in model', err);
});
export default router;
