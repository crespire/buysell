/// <reference types="cypress"/>

describe('Register User', () => {
  it('Correctly signs in a registered user', () => {
    cy.visit('/')
    cy.contains('Sign In').click();
    cy.location('pathname').should('eq', '/signin');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.intercept('POST', '/login', { fixture: 'verified_user.json' }).as('userLogin');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/');
    cy.contains('Hello testuser1').should('be.visible');
    cy.contains('Edit Account').should('be.visible');
    cy.contains('New Post').should('be.visible');
  });
});