Feature: League actions

  Background:
    Given default league is "bronze"
    And "player1" is registered
    And league moving threshold is 10 points

  Scenario: Move player to a different league
    When "plaeyr1" is moved to "silver"
    Then "player1" is in league "silver"

  Scenario: Set criteria for moving to a new league
    When league moving threshold is changed to 100
    Then league moving threshold is now 100

  Scenario: Set criteria for movin to a new league failure
    When league moving threshold is changed to 0
    Then league moving threshold is now 10

  Scenario: Set default league
    When default league is "silver"
    And "player2" is registered
    Then "player2" is in league "silver"