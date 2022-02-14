Feature: Verify the Blotter functionality

Scenario Outline: User should be able to sort the columns in Descending order which are present in the Blotter section
Given User is on Home page
When User Clicks on "<Column>" only once
Then User should see the sorting happening in Descending order for column "<Column>"
Examples:
|Column|
|Trade ID|
|Trade Date|
|Direction|
|Status|
|Rate|
|Deal CCY|
|Notional|


Scenario Outline: User should be able to sort the columns in Ascending order which are present in the Blotter section
Given User is on Home page
When User Clicks on "<Column>" two times
Then User should see the sorting happening in Ascending order for column "<Column>"
Examples:
|Column|
|Trade ID|
|Trade Date|
|Direction|
|Status|
|Rate|
|Deal CCY|
|Notional|