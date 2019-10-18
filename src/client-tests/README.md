# Client Tests

Collection of both smoke tests and functional tests to be run to verify the application. 
Able to:
 - run locally using `npm run test`, against a local running instance or using debug tools.
 - run against an environment eg. dev, prod. 
 - be able to run within out circleci build with results posted to slack. 

Taget is defined using environment variable: 

```
TEST_URL=http://localhost:3000
```




