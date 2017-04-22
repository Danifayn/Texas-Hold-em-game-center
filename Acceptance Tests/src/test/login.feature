Feature: Sign in system for the Texas Hold'em lobby

  Scenario Outline: Correct username/password combination sign in
    Given <username> not logged in
    When guest requests to log in with <username> and <password>
    Then logged in as <username>
    Examples:
      | username | password |
      | "testUser"| "123" |

  Scenario Outline: Incorrect username/password combination sign in
    When guest requests to log in with <username> and <password>
    Then log in for <username> fails
    Examples:
      | username | password |
      | "testUser" | "122"  |
      | "testUser" | ""     |
      | ""         |  ""    |
      | ""         |  "123" |

  Scenario Outline: Sign out of system
    Given <user> is logged in
    When <user> requests to log out
    Then <user> is logged out
    Examples:
      | user |
      | "testUser" |
