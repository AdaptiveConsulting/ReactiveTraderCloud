var testsContext = require.context(".", true, /Tests.js$/);
testsContext.keys().forEach(testsContext);
