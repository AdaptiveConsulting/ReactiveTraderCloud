@echo off

SET user=%USERDOMAIN%\%USERNAME%

netsh http add urlacl url=http://localhost:2113/ user=%user%
netsh http add urlacl url=http://127.0.0.1:2113/ user=%user%

pause