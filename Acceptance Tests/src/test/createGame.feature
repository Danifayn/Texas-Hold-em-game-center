Feature: Create a texas hold'em game

  Background:
    Given "testUser" is registered
    And "testUser" is logged in
    And "game" has not been created

  Scenario Outline: A player successfully creates a game
    Given "testUser" has <cash> cash
    When "testUser" creates "game" with <game type> <buy in> <chip policy> <min bet> <min playres> <max players> <allow spectators>
    Then "game" exists as a game
    And "testUser" is in the "game"
    Examples:
      | cash | game type | buy in   | chip policy   | min bet   | min playres   | max players   | allow spectators |
      | 100  | "limit"   |  "10"    | "5"           | "3"       | "2"           | "10"          | "true"           |
      | 100  | "no limit"|  "100"   | "5"           | "3"       | "10"          | "10"          | "false"          |
      | 100  |"pot limit"|  "100"   | "5"           | "3"       | "10"          | "10"          | "false"          |

  Scenario Outline: A player attempts to create a game but fills a field with a negative number
    Given "testUser" has <cash> cash
    When "testUser" creates "Game" with "limit" <buy in> <chip policy> <min bet> <min playres> <max players> "true"
    Then "game" does not exist as a game
    Examples:
      | cash | buy in   | chip policy   | min bet   | min playres   | max players |
      | 100  |  "-1"    | "5"           | "3"       | "2"           | "10"        |
      | 100  |  "100"   | "-5"          | "3"       | "2"           | "10"        |
      | 100  |  "100"   | "5"           | "-3"      | "2"           | "10"        |
      | 100  |  "100"   | "5"           | "3"       | "-2"          | "10"        |
      | 100  |  "100"   | "5"           | "3"       | "2"           | "-10"       |

  Scenario Outline: A player attempts to create a game but fills a number field with a word
    Given "testUser" has <cash> cash
    When "testUser" creates "Game" with "limit" <buy in> <chip policy> <min bet> <min playres> <max players> "true"
    Then "game" does not exist as a game
    Examples:
      | cash | buy in   | chip policy   | min bet   | min playres   | max players |
      | 100  |  "one"   | "5"           | "3"       | "2"           | "10"        |
      | 100  |  "100"   | "five"        | "3"       | "2"           | "10"        |
      | 100  |  "100"   | "5"           | "three"   | "2"           | "10"        |
      | 100  |  "100"   | "5"           | "3"       | "two"         | "10"        |
      | 100  |  "100"   | "5"           | "3"       | "2"           | "ten"       |

  Scenario Outline: A player attempts to create a game but does not fill a field
    Given "testUser" has <cash> cash
    When "testUser" creates "Game" with "limit" <buy in> <chip policy> <min bet> <min playres> <max players> "true"
    Then "game" does not exist as a game
    Examples:
      | cash | buy in   | chip policy   | min bet   | min playres   | max players |
      | 100  |  ""      | "5"           | "3"       | "2"           | "10"        |
      | 100  |  "100"   | ""            | "3"       | "2"           | "10"        |
      | 100  |  "100"   | "5"           | ""        | "2"           | "10"        |
      | 100  |  "100"   | "5"           | "3"       | ""            | "10"        |
      | 100  |  "100"   | "5"           | "3"       | "2"           | ""          |

  Scenario Outline: A player attempts to create a game but can't afford the buy-in he set
    Given "testUser" has <cash> cash
    When "testUser" creates "Game" with "limit" <buy in> "5" "3" "2" "10" "true"
    Then "game" does not exist as a game
    Examples:
      | cash | buy in |
      | 10   | "100"  |
      | 0    | "1"    |

   Scenario Outline: A player attempts to create a game but sets up player count incorrectly
     Given "testUser" has 100 cash
     When "testUser" creates "Game" with "limit" "10" "5" "3" <min playres> <max players> "true"
     Then "game" does not exist as a game
     Examples:
       | min playres   | max players |
       | "1"           | "10"        |
       | "0"           | "10"        |
       | "5"           | "4"         |


  Scenario:  A player attempts to create a game but a game with the same name already exists
    Given "game" has been created
    And "testUser" has 100 cash
    When "testUser" creates "game" with "limit" "10" "5" "3" "2" "10" "true"
    Then "game" exists as a game
    And "testUser" is not in the "game"
