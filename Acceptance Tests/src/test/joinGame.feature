Feature: Join game

  Background:
    Given "testUser" is registered
    And "testUser" is logged in

  Scenario Outline: Player successfully joins a game
    Given "testUser" has <cash> cash
    And "Game" has <buy-in> to join in the game
    When "testUser" requests to join the "game"
    Then "testUser" is in the "game"
    Examples:
      | cash | buy-in |
      | 100  | 10     |
      | 100  | 100    |

  Scenario: An additional player allows the game to start
    Given "game" lacks one player to start
    When "testUser" requests to join the "game"
    Then "game" can start

  Scenario: An additional player does not allow the game to start
    Given "game" lacks two player to start
    When "testUser" requests to join the "game"
    Then "game" can't start

  Scenario: Player attempts to join a full game
    Given game is full
    When "testUser" requests to join the "game"
    Then "testUser" is not in the "game"

  Scenario Outline: Player attempts to join a game but can't pay buy-in
    Given "testUser" has <cash> cash
    And "Game" has <buy-in> to join in the game
    When "testUser" requests to join the "game"
    Then "testUser" is not in the "game"
    Examples:
      | cash | buy-in |
      | 0    | 1      |
      | 10   | 11     |

  Scenario: Spectator successfully joins a game
    Given "testUser" has 0 cash
    And "Game" has 100 to join in the game
    And game is full
    When "testUser" requests to spectate the "game"
    Then "testUser" is spectating the "game"


