Feature: Demo

Scenario Outline: Successful Trade "<currency>"
Given Reactive Trader is open
And "<currency>" price tile is displayed
When user performs "<operation>" trade for "<quantity>" of "<currency>"
Then trade is success
Examples:
|currency| operation | quantity|
|USD/JPY| Buy | 1000|

|EUR/USD| BUY | 30000|