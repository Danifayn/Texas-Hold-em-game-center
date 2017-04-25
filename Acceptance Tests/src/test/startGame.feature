Feature: Start game

  Background:
    Given "player1" is registered
    And "player2" is registered
    And "player1" has 5 cash
    And "player2" has 5 cash
    And "game1" has not been created
    And "player1" creates "game1" with "limit" "1" "1" "1" "2" "10" "true"
    And "player2" is in "game1"

  Scenario: Start a game
    When "game1" starts
    Then "player1" has 0 cash left
    And "player2" has 0 cash left
    And "player1" has 2 cards in "game1"
    And "player2" has 2 cards in "game1"
    And "player1" has 1 betted in "game1"
    And "player2" has 2 betted in "game1"
    And it is "player1" turn in "game1"
