const rewireStyledComponents = require('react-app-rewire-styled-components')

module.exports = function override(config, env) {
    return rewireStyledComponents(config, env);
}