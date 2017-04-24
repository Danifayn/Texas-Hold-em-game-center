Feature: Game actions such as fold, call, raise

  Background:
    Given "player1" is registered
    And "player2" is registered
    And "game1" has not been created
    And "player1" creates "game1" with "limit" "1" "5" "3" "2" "10" "true"
    And "player2" is in "game1"
    And "game1" starts


  Scenario: Successful check
    Given "player1" has 10 chips in "game1"
    And "player1" can check in "game1"
    When "player1" checks in "game1"
    Then "player1" checked in "game1"

  Scenario: Unsuccessful check
    Given "player1" has 10 chips in "game1"
    And "player1" needs to add 10 chips to call in "game1"
    When "player1" checks in "game1"
    Then "player1" has not checked in "game1"

  Scenario: Fold
    When "player1" folds in "game1"
    Then "player1" not participating in pot in "game1"

  Scenario Outline: Successful Raise
    Given "game1" type is <game type>
    And big blind is <big blind> in "game1"
    And round number is <round number> in "game1"
    And "game1" pot is <pot size>
    When "player1" raises <raise> in "game1"
    Then "player1" raised <raise> in "game1"
    And pot size increased by <raise> in "game1" from <pot size>

    Examples:
      | game type | big blind | round number | pot size | raise |
      | "limit"     | 2         | 1            | 1        | 2     |
      | "limit"     | 2         | 3            | 1        | 4     |
      | "no limit"  | 2         | 1            | 3        | 10    |
      | "pot limit" | 1         | 1            | 3        | 3     |

  Scenario Outline: Unsuccessful Raise
    Given "game1" type is <game type>
    And big blind is <big blind> in "game1"
    And round number is <round number> in "game1"
    And "game1" pot is <pot size>
    When "player1" raises <raise> in "game1"
    Then "player1" has not raised in "game1"

    Examples:
      | game type | big blind | round number | pot size | raise |
      | "limit"     | 2         | 1            | 1        | 2     |
      | "limit"     | 2         | 3            | 1        | 4     |
      | "no limit"  | 2         | 1            | 3        | 10    |
      | "pot limit" | 1         | 1            | 3        | 3     |



