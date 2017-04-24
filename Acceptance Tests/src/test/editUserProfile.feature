Feature: Edit profile system

  Background:
    Given register is filled with: "testUser", "123", "testMail@gmail.com", "Bob", "Dylan", "URL"

  Scenario: Change password successfully
    When "testUser" asks to change password and fills pw with "321" and confirmation with "321"
    Then "testUser" password is "321"

  Scenario Outline: Change password unsuccessfully
    When "testUser" asks to change password and fills pw with <newPw> and confirmation with <newPwConfirm>
    Then "testUser" password is "123"
    Examples:
      | newPw | newPwConfirm |
      | "hello" | "hllo"     |
      | ""      | ""         |

  Scenario: Edit personal profile successfully
    When "testUser" asks to change fName to "Dan", lName to "Rej", profile pic to "URI"
    Then "testUser" fName is "Dan", lName is "Rej", profile pic is "URI"
