START CMD /C "dotnet run -p Adaptive.ReactiveTrader.Server.ReferenceDataRead config.dev.json"
timeout /t 1
START CMD /C "dotnet run -p Adaptive.ReactiveTrader.Server.Pricing config.dev.json"
timeout /t 1
START CMD /C "dotnet run -p Adaptive.ReactiveTrader.Server.TradeExecution config.dev.json"
timeout /t 1
START CMD /C "dotnet run -p Adaptive.ReactiveTrader.Server.Blotter config.dev.json"
timeout /t 1
START CMD /C "dotnet run -p Adaptive.ReactiveTrader.Server.Analytics config.dev.json"