@echo off
call "GetDependencies.bat"
echo
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.ReferenceDataRead dev"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Pricing dev"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.TradeExecution dev"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Blotter dev"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Analytics dev"