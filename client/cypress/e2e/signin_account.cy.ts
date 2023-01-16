/// <reference types="cypress"/>

describe('Registered User', () => {
  it('correctly signs in a registered user', () => {
    cy.visit('/')
    cy.contains('Sign In').click();
    cy.location('pathname').should('eq', '/signin');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.intercept('POST', '/login', { statusCode: 200, fixture: 'verified_user.json' }).as('userLogin');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/');
    cy.contains('Hello testuser1').should('be.visible');
    cy.contains('Edit Account').should('be.visible');
    cy.contains('New Post').should('be.visible');
  });

  it('should allow a user to reset their password', () => {
    cy.visit('/signin');
    cy.get("a[href='/reset-password']").click();
    cy.location('pathname').should('eq', '/reset-password');
    cy.get("input[name='email']").type('testuser@test.com');
    cy.intercept('POST', '/reset-password-request', { "success": "An email has been sent to you with a link to reset the password for your account." }).as('userPassResetRequest');
    cy.get('form').submit();
    cy.visit('reset-password/:token');
    cy.get("input[name='pass']").type('password1');
    cy.get("input[name='passconf']").type('password1');
    cy.intercept('POST', '/reset-password', { statusCode: 200, fixture: 'verified_user.json' }).as('userResetPassSuccess');
    cy.get('form').submit();
  });
});