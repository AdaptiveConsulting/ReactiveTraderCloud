import Guard from './guard';
import * as logger from './logger';
import * as disposables from './disposables';
import SchedulerService from './schedulerService';
import * as service from './service';
import RetryPolicy from './observableExtentsions/retry-policy';
import utils from './utils';

export { default as utils } from './utils';
export { default as router } from './router';
export { default as logger } from './logger';
export { SchedulerService };
export { RetryPolicy };
export { Guard };

// these imports add functionality to rx
import './observableExtentsions/retry-policy-ext';
import './observableExtentsions/subscribeWithRouter';

export default {
  Guard,
  logger,
  disposables,
  SchedulerService,
  service,
  RetryPolicy,
  utils
};
