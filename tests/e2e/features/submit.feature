Feature: Submit print request
  As an authenticated user
  I want to submit a print request
  So that I can see it later in history

  Background:
    Given the app is running
    And I am authenticated

  Scenario: Submit a request with in-stock color
    Given I open "/submit"
    When I enter file url "https://files.com/model.stl"
    And I choose plastic "PLA"
    And I choose color "Blue"
    And I submit the request form
    Then I should be on "/history"
    And I should see at least 1 row in history
