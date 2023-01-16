/// <reference types="cypress"/>

describe('Verifies an unverified user', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Sign In').click();
    cy.location('pathname').should('eq', '/signin');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.intercept('POST', '/login', { fixture: 'unverified_user.json' }).as('userLogin');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/');
  });

  it('displays verification request in header when logged in with unverfied user', () => {
    cy.visit('/')
    cy.contains('Hello testuser1').should('be.visible');
    cy.contains('Please confirm your account by checking your email and clicking the link!');
  });

  it('display error if no token is provided', () => {
    cy.visit('/verify-account');
    cy.contains('No token provided.').should('be.visible');
  });

  it('shows a button when token is provided', () => {
    cy.visit('/verify-account/token');
    cy.contains('Verify My Account!').should('be.visible');
  });

  it('verifies a user when a token is provided', () => {
    cy.visit('/verify-account/token');
    cy.intercept('POST', '/verify-account', { fixture: 'verified_user.json' }).as('userVerify');
    cy.contains('Verify My Account!').click();
    cy.visit('/');
    cy.contains('Edit Account').should('be.visible');
  });
});

describe('when trying to access page with a verified user', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('Sign In').click();
    cy.location('pathname').should('eq', '/signin');
    cy.get('input[name=email]').type("testuser@test.com");
    cy.get('input[name=pass]').type('pass1234');
    cy.intercept('POST', '/login', { statusCode: 200, fixture: 'verified_user.json' }).as('userLogin');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/');
  });

  it('redirects to main', () => {
    cy.visit('/verify-account');
    cy.location('pathname').should('eq', '/');
  })
});