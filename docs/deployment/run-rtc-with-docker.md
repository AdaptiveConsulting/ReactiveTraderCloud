# Run Reactive Trader Cloud with docker (without kubernetes)

## Setup and validate docker
Follow the [docker setup instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)

## Choose a method to run
### already pre-built images
- You can run Reactive Trader Cloud locally using pre-built Docker images by running the runAll script in the docker directory:
    ```bash
    ./deploy/docker/runAll
    ```

This will download the 4 images required for Reactive Trader Cloud and run them.

### your local RTC images
- Follow the [local build instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/build-rtc-locally.md)
- You can then run the built images by passing the `BUILD_ID` to the `./runAll` script
    ```bash
    ./deploy/docker/runAll localbuild
    ```
- You will see the docker-compose mechanism start your containers and print the logs

## See it running
Open a browser, navigate to the docker address (`localhost` for Linux users and something like `10.0.75.2` for Windows/Mac users) and the web client will load.

## Test ReactiveTrader
After having started ReactiveTrader, you can run the tests.

The tests use the **reactivetrader/servers** to connect backends.

In a different bash, run:
```bash
# If you build/run with a `build_id` (ie: `localbuild`)
./deploy/docker/testAll localbuild
```

This should output something like this:
```bash
 
xUnit.net .NET CLI test runner (64-bit .NET Core ubuntu.14.04-x64)
  Discovering: Adaptive.ReactiveTrader.Server.IntegrationTests
  Discovered:  Adaptive.ReactiveTrader.Server.IntegrationTests
  Starting:    Adaptive.ReactiveTrader.Server.IntegrationTests

...
some test data
...

  Finished:    Adaptive.ReactiveTrader.Server.IntegrationTests
=== TEST EXECUTION SUMMARY ===
   Adaptive.ReactiveTrader.Server.IntegrationTests  Total: 8, Errors: 0, Failed: 0, Skipped: 0, Time: 9.464s
```

## Stop all the running containers
You can stop all the containers by hitting ctrl+c on the runAll process or by running:
```bash
./deploy/docker/killAll
```
