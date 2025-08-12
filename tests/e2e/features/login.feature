Feature: Login / Register
  As a user
  I want to log in or register
  So I can access the dashboard

  Background:
    Given the app is running

  Scenario: Register then land on dashboard
    Given I open "/login"
    When I switch to register mode
    And I fill email "user@example.com" and password "strong-pass"
    And I submit auth form
    Then I should be on "/dashboard"
    And I should see text "Welcome to your dashboard"

  Scenario: Login with existing account
    Given I open "/login"
    When I fill email "user@example.com" and password "strong-pass"
    And I submit auth form
    Then I should be on "/dashboard"
