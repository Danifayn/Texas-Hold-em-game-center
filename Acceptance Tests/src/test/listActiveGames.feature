Feature: List active games

  Scenario: List all joinable games
    Given "testUser" is registered
    And "testUser" is logged in
    And "testUser" has 10 cash
    And "game1" has 1 to join in the game
    And "game2" has 100 to join in the game
    And "game3" has maximum players
    Then only "game1" is in the available games list for "testUser"

  Scenario: List all spectatable games
    Given "player1" is registered
    And "player2" is registered
    And "player1" creates "game1" with "limit" "0" "5" "3" "2" "10" "true"
    And "player2" creates "game2" with "no limit" "0" "5" "3" "2" "10" "false"
    Then only "game1" is in the available spectatable games list for "testUser"
