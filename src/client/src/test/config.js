const cfgManager = require('node-config-manager');
cfgManager.addConfig('app');
const appCfgByGetConfig = cfgManager.getConfig('app');
appCfgByMethod = cfgManager.method.App();

module.exports.getConfig = function() {
  return appCfgByMethod;
};
