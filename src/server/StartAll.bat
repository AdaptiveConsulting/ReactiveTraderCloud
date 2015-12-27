@echo off
call "GetDependencies.bat"
echo
cd Adaptive.ReactiveTrader.Server.Launcher
dnx run dev