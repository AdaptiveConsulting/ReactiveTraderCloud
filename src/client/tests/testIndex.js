var testsContext = require.context(".", true, /tests.js$/);
testsContext.keys().forEach(testsContext);
