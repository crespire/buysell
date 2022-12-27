/// <reference types="cypress"/>

describe('Register User', () => {
  it('Correctly registers a user', () => {
    cy.visit('/')
    cy.contains('Sign Up').click();
    cy.location('pathname').should('eq', '/signup');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.get('input[name=passconf').type('pass1234');
    cy.get('input[name=name').type('testuser1')
    cy.get('form').submit();
    // Intercept doesn't seem to be working, getting 404 on the fetch
    cy.intercept('POST', '/create-account', { fixture: 'user.json' }).as('userCreate');
    cy.location('pathname').should('eq', '/');
    cy.get('nav').contains('testuser1');
  });
});