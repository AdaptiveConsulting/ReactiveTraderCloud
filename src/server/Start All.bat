@echo off
call "Get Dependencies.bat"
echo
START CMD /C "dnx -p Adaptive.ReactiveTrader.MessageBroker run"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Reference run"
START CMD /C "dnx -p Adaptive.ReactiveTrader.Server.Pricing run"