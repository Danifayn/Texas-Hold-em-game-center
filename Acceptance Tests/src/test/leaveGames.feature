Feature: Leave an active game

  Background:
    Given "testUser" is registered
    And "testUser" is logged in

  Scenario:
    Given "testUser" plays in "game"
    When "testUser" asks to leave "game"
    Then "testUser" is not in the "game"

  Scenario:
    Given "testUser" spectates in "game"
    When "testUser" asks to leave "game"
    Then "testUser" is not spectating in the "game"

  Scenario:
    Given "testUser" is waiting for "game" to start
    And "game" has minimum players
    When "testUser" asks to leave "game"
    Then "game" can't start