/// <reference types="cypress"/>

describe('Logs out a user', () => {
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
    cy.intercept('POST', '/logout', { statusCode: 200, body: { "success": "logged out" } }).as('userLogout');
    cy.contains('Sign Out').click();
    cy.contains('Sign Up').should('be.visible');
    cy.contains('Sign In').should('be.visible');
  });
});
