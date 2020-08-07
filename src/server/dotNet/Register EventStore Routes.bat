@echo off

SET user=%USERDOMAIN%\%USERNAME%

netsh http add urlacl url=https://localhost:2113/ user=%user%
netsh http add urlacl url=https://127.0.0.1:2113/ user=%user%

pause