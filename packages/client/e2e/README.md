[![image](images/adaptive-logo.svg)](http://weareadaptive.com/)

# Reactive Trader®

Reactive Trader® is a real-time FX trading platform designed to showcase reactive programming principles across the full application stack.

## Development

To run the web UI

1. Fork and clone the ReactiveTraderCloud repo and checkout branch RTC-QA-BUG-VERSION

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

## QA Exercise

1. Three UI bugs have been added on this branch, try and find them.
2. Log bugs for them, providing all the necessary information required for investigation. You can use a doc/template
   of your choice e.g google docs/spreadsheets etc.
<details>
   1. Steps to reproduce
   2. Expected result:
   Expected result description
   3. Actual result:
   Actual result description
   4. Investigate the bug and indicate whether it is a UI or Server issue (BE / FE labels). 
   5. Add where possible:
   Screenshots
   Videos
   Console errors
   6. If it is a server error add logs / stack trace (mandatory)
   7. Specify Severity and Priority of the bugs based on your analysis
</details>
3. Using the playwright framework, add automation tests to cover the failing scenarios as identified by the bugs.