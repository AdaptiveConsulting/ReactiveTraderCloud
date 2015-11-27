@echo off
call "Get Dependencies.bat"
echo
START CMD /C "dnx -p Adaptive.ReactiveTrader.MessageBroker run"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Reference run"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Pricing run"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.TradeExecution run"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Blotter run"