Feature: Deal cards to all players in the game

  Scenario: All cards are dealt to all active players in the game
    Given "player1" is registered
    And "player2" is registered
    And "player1" has 5 cash
    And "player2" has 5 cash
    And "game1" has not been created
    And "player1" creates "game1" with "limit" "1" "1" "1" "2" "10" "true"
    And "player2" is in "game1"
    And "game1" starts
    When cards are dealt in "game1"
    Then "player1" has 3 cards in "game1"