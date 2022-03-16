Feature: Demo

    Scenario Outline: Successful "<direction>" Trade for "<symbol>"
        Given Reactive Trader is open
        And "<symbol>" price tile is displayed
        When user performs "<direction>" trade for "<notional>" of "<symbol>"
        Then trade is success for "<notional>" and "<direction>"
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


    # Scenario Outline: Timeout Trade for "<symbol>"
    #     Given Reactive Trader is open
    #     And "<symbol>" price tile is displayed
    #     When user performs "<direction>" trade for "<notional>" of "<symbol>"
    #     Then trade is timed-out and then success for "<notional>" and "<direction>"
    #     Examples:
    #         | symbol  | direction | notional |
    #         | EUR/JPY | Buy       | 1000     |

    Scenario Outline: High Notional RFQ for "<symbol>"
        Given Reactive Trader is open
        And Sell&Buy Buttons are disabled for "<symbol>"
        When User Clicks on Initiate RFQ button for "<symbol>"
        Then Sell&Buy Buttons become enable for "<symbol>"
        And After 10 secs Requote button appears for "<symbol>"
        Examples:
            | symbol  |
            | NZD/USD |

    Scenario Outline: RFQ mode scenario for "<symbol>"
        Given Reactive Trader is open
        And User edits the notional field with "<notional>" for "<symbol>"
        When User Clicks on Initiate RFQ button for "<symbol>"
        Then Sell&Buy Buttons become enable for "<symbol>"
        And  User clicks on Reject button for "<symbol>"
        Then Requote button again appears on the page for "<symbol>"
        And User clicks on Requote button "<symbol>"
        Then After 60 secs Prices will be disapper and requote button appears again for "<symbol>"


        Examples:
            | symbol  | notional |
            | USD/JPY | 10000001 |


    Scenario Outline: Notional scenario for "<symbol>"
        Given Reactive Trader is open
        And User edits the notional field with "<notional>" for "<symbol>"
        Then User sees the "<expected>" value on "<notional>" field for "<symbol>"

        Examples:
            | symbol  | notional   | expected     |
            | USD/JPY | 1m         | 1,000,000    |
            | USD/JPY | 1k         | 1,000        |
            | USD/JPY | 1000000001 | Max exceeded |


    # Scenario: Toggle Scenario for Currencies and Graphs
    #     Given Reactive Trader is open
    #     When User clicks on price view
    #     Then User is not able to see price graph for any Currencies
    #     And User clicks on graph view
    #     Then User is able to see price graph for all currencies


    Scenario Outline:  Toggle between Currencies for "<currency>"
        Given Reactive Trader is open
        And User clicks on "<currency>" tab
        Then User sees currency combination only for "<currency>"

        Examples:
            | currency |
            | ALL      |
            | EUR      |
            | AUD      |
            | NZD      |
            | GBP      |
            | USD      |