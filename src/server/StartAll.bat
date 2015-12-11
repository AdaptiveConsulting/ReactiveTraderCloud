@echo off
call "GetDependencies.bat"
echo
cd Adaptive.ReactiveTrader.Server.Launcher
dnx run a b exec p ref es mb