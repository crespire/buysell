/// <reference types="cypress"/>

describe('Register User', () => {
  it('Correctly registers an unverified user', () => {
    cy.visit('/')
    cy.contains('Sign Up').click();
    cy.location('pathname').should('eq', '/signup');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.get('input[name=passconf]').type('pass1234');
    cy.get('input[name=name]').type('testuser1');
    cy.intercept('POST', '/create-account', { fixture: 'user.json' }).as('userCreate');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/');
    cy.contains('Hello testuser1').should('be.visible');
    cy.contains('Please confirm your account by checking your email and clicking the link!').should('be.visible');
    cy.get('nav').should('not.contain', 'New post');
  });
});