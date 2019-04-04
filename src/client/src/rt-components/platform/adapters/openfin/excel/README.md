# ReactiveTrader integration with Excel

Reactive Trader's [Excel interoperability features](https://weareadaptive.com/2016/10/05/rich-desktop-experience-openfin/) come in two flavours: 

## Custom .NET add-on

- Consists of a .NET add-on executing inside Excel, using OpenFin's `InterApplicationBus` to communicate with ReactiveTrader via pub/sub.

- Developed as a separate project. See [repo here](https://github.com/AdaptiveConsulting/OpenFin) (private).

- Excel must be manually configured to trust the plugin. See [installation instructions](../../../../../../../../docs/setup/reactive-trader-excel.md).

- No specific configuration needed on the ReactiveTrader side.

## OpenFin's Excel JS adapter

- Makes use of [OpenFin's JavaScript Excel API](https://github.com/openfin/excel-api-example/).

- No specific configuration required in Excel, other than giving consent the very first time. When the Spreadsheet is launched from ReactiveTrader via `ExcelApi`, OpenFin takes care of the rest.

- The JSON manifest of the OpenFin app must load the `.zip` package with the plugin itself (which will run within Excel), and the application must include a [`preloadScript`](http://cdn.openfin.co/jsdocs/stable/global.html#preloadScript) entry with the JS scripts to be used on the ReactiveTrader side.

- Limited functionality, in particular for the *Close Position* feature.

- Communication between the application and Excel works fine in `localhost` but there are issues capturing Excel events when running on a server. As of April 2019 there's an open support ticket with OpenFin to deal with this.

## `ExcelAdapter`s

Both Excel integration methods are available through [`LegacyExcelAdapter`](./legacyExcelAdapter.ts) and [`JSExcelAdapter`](./excelAdapter.ts) respectively, which implement the `ExcelAdapter` interface. 

Due to the limitations of the latter, at the time of writing the former is preferred, and enabled by the `USE_LEGACY_EXCEL_ADAPTER` flag on [`./index.ts`](./index.ts).



