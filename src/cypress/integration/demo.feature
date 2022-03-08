Feature: Demo

    Scenario Outline: Successful "<direction>" Trade for "<symbol>"
        Given Reactive Trader is open
        And "<symbol>" price tile is displayed
        When user performs "<direction>" trade for "<notional>" of "<symbol>"
        Then trade is success for "<notional>"
        Examples:
            | symbol  | direction | notional |
            | USD/JPY | Buy       | 1000     |
            | USD/JPY | Sell      | 1000     |


    Scenario Outline: Rejected Trade for "<symbol>"
        Given Reactive Trader is open
        And "<symbol>" price tile is displayed
        When user performs "<direction>" trade for "<notional>" of "<symbol>"
        Then trade is rejected for "<notional>"
        Examples:
            | symbol  | direction | notional |
            | GBP/JPY | Buy       | 1000     |


    Scenario Outline: Timeout Trade for "<symbol>"
        Given Reactive Trader is open
        And "<symbol>" price tile is displayed
        When user performs "<direction>" trade for "<notional>" of "<symbol>"
        Then trade is timed-out and then success for "<notional>"
        Examples:
            | symbol  | direction | notional |
            | EUR/JPY | Buy       | 1000     |
