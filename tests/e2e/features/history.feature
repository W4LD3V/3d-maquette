Feature: History listing
  Background:
    Given the app is running
    And I am authenticated
    And the history has 2 requests

  Scenario: Delete a request
    Given I open "/history"
    When I delete the first request
    Then the table should have 1 row
