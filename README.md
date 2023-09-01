[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/AdaptiveConsulting/ReactiveTraderCloud/CI)](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/actions?query=workflow%3ACI)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/AdaptiveConsulting/ReactiveTraderCloud)](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/latest)
[![GitHub](https://img.shields.io/github/license/AdaptiveConsulting/ReactiveTraderCloud)](https://opensource.org/licenses/Apache-2.0)

[![image](images/adaptive-logo.svg)](http://weareadaptive.com/)

# Reactive Trader®

Reactive Trader® is a real-time FX trading platform designed to showcase reactive programming principles across the full application stack.

Written in React and RxJs / React-RxJs and running on [Hydra](https://weareadaptive.com/platform-solutions/), the platform will continue to evolve and use the latest technologies.

Please see [our Showcase page](https://weareadaptive.com/showcase/) for a full list of the latest features.

![image](/packages/client/public-workspace/images/previews/reactive-trader.PNG)

## Demo

- [Web & Mobile]
- [OpenFin] installer: [Windows][openfin-win], [Mac][openfin-mac]
- [Finsemble] smart desktop installer: [Windows][finsemble-win]
- [Style guide]: Colours, iconography, typography, atoms and molecules
- [Storybook]: Explore individual React components

[web & mobile]: https://www.reactivetrader.com
[openfin]: https://openfin.co/
[finsemble]: https://cosaic.io/finsemble/
[storybook]: https://www.reactivetrader.com/storybook
[style guide]: https://www.reactivetrader.com/styleguide
[openfin-win]: ./install/Reactive-Launcher-Demo.exe?raw=true
[openfin-mac]: ./install/Reactive-Launcher-Demo.dmg?raw=true
[finsemble-win]: https://storage.googleapis.com/reactive-trader-finsemble/pkg/ReactiveTraderFinsemble.exe

## Development

To run the web UI

1. Fork and clone the ReactiveTraderCloud repo ([see Contributing page](CONTRIBUTING.md))

2. [See client README](packages/client/README.md)

<details>
<summary>Manually update contracts for Trading Gateway API</summary>

1. Open [hydra-reactive-trader](`https://github.com/AdaptiveConsulting/hydra-reactive-trader`) project in IntelliJ IDEA and run:

   ```
   ./gradlew
   ```

2. Copy file `component/gateway/trading/api/build/generated-sources/codecs/main/resources/trading-gateway.hyer` to UI project `src/client/trading-gateway.hyer`

3. Back in src/client, run:
   ```
   npm run generateCod
   ```
   This will regenerate TradingGateway.ts `(file://./src/client/src/generated/TradingGateway.ts)`
   </details>

<details>
<summary>Run against local Backend Services</summary>

1. Follow instructions to start [Backend Services](`https://github.com/AdaptiveConsulting/hydra-reactive-trader#building-the-project`)

2. Run:
   ```
   VITE_HYDRA_URL=ws://localhost:8929 npm start
   ```
   </details>

## CI/CD

We practice continuous integration and deployment. Every branch and pull request triggers a build and deployment to an ephemeral environment. Merging to master causes a build and deployment to our [development environment](https://web.dev.reactivetrader.com).

## Contributing

Please see our [contribution guidelines](./CONTRIBUTING.md).

## Who are we?

Reactive Trader was written by the team at [Adaptive](http://weareadaptive.com/), a consultancy that specialises in building real-time trading systems.

Please [contact us](https://weareadaptive.com/contact/) if you'd like to learn more, or follow us via our [blog](https://weareadaptive.com/category/blog/), [Twitter](https://twitter.com/WeAreAdaptive), or [LinkedIn](https://www.linkedin.com/company/adaptive-consulting-ltd/).

## License

This application is made available under the [Apache license v2.0](./LICENSE).
