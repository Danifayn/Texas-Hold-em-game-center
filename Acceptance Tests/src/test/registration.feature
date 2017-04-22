Feature: Registration system

  Scenario Outline: A new user successfully registers to the system
    Given <username> not registered
    When register is filled with: <username>, <password>, <email>, <firstName>, <lastName>, <profilePicURL>
    Then registered as <username>
    Examples:
      | username | password | email | firstName | lastName | profilePicURL |
      | "testUser"| "123"   | "testEmail@gmail.com" | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "testEmail@gmail.com" | ""    | "Dylan" | "URL"|
      | "testUser"| "123"   | "testEmail@gmail.com" | "Bob" | ""      | "URL"|
      | "testUser"| "123"   | "testEmail@gmail.com" | "Bob" | "Dylan" | ""   |


  Scenario Outline: An illegal email is entered while registering
    Given <username> not registered
    When register is filled with: <username>, <password>, <email>, <firstName>, <lastName>, <profilePicURL>
    Then register as <username> failed
    Examples:
      | username | password | email | firstName | lastName | profilePicURL |
      | "testUser"| "123"   | "testEmail@gmailcom" | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "testEmailgmail.com" | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "@gmail.com"         | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "testEmail@"         | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "testEmail@.com"     | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "@"                  | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "hi my name is bob"  | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | "testEmail@gmail."   | "Bob" | "Dylan" | "URL"|

  Scenario Outline: One of the essential fields is left empty while registering
    Given <username> not registered
    When register is filled with: <username>, <password>, <email>, <firstName>, <lastName>, <profilePicURL>
    Then register as <username> failed
    Examples:
      | username | password | email | firstName | lastName | profilePicURL |
      | ""        | "123"   | "testEmail@gmail.com" | "Bob" | "Dylan" | "URL"|
      | "testUser"| ""      | "testEmail@gmail.com" | "Bob" | "Dylan" | "URL"|
      | "testUser"| "123"   | ""                    | "Bob" | "Dylan" | "URL"|


  Scenario Outline: Username is taken for registration
    Given <username> is registered
    When register is filled with: <username>, <password>, <email>, <firstName>, <lastName>, <profilePicURL>
    Then register as <username> failed
    Examples:
      | username | password | email | firstName | lastName | profilePicURL |
      | "testUser"| "123"   | "testEmail@gmail.com" | "Bob" | "Dylan" | "URL"|