/// <reference types="cypress"/>

describe('Verifies an unverified user', () => {
  before(() => {
    cy.visit('/')
    cy.contains('Sign In').click();
    cy.location('pathname').should('eq', '/signin');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.intercept('POST', '/login', { fixture: 'unverified_user.json' }).as('userLogin');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/');
    
  });

  it('correctly displays verification request in header when logged in with unverfied user', () => {
    cy.visit('/')
    cy.contains('Hello testuser1').should('be.visible');
    cy.contains('Please confirm your account by checking your email and clicking the link!');
  });
});