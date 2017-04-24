Feature: Filter active games

  Background:
    Given "player1" is registered
    And "player2" is registered
    And "player3" is registered
    And "game1" has not been created
    And "game2" has not been created
    And "game3" has not been created
    And "player1" creates "game1" with "limit" "1" "5" "3" "2" "10" "true"
    And "player2" creates "game2" with "no limit" "2" "5" "3" "2" "10" "true"
    And "player3" creates "game3" with "pot limit" "3" "5" "3" "2" "10" "true"

  Scenario: Filter games by preferences
    When "testUser" filters by preference "limit"
    Then only "game1" is in the available games list for "testUser"

  Scenario: Filter games by pot size
    When "testUser" filters by pot size 3
    Then only "game3" is in the available games list for "testUser"

  Scenario: Filter games by player name
    When "testUser" filters by player name "player2"
    Then only "game2" is in the available games list for "testUser"
