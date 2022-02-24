Feature: Demo

Scenario Outline: Successful Trade "<symbol>"
Given Reactive Trader is open
And "<symbol>" price tile is displayed
When user performs "<direction>" trade for "<notional>" of "<symbol>"
Then trade is success
Examples:
|symbol| direction | notional|
|GBP/JPY| Buy | 1000|
