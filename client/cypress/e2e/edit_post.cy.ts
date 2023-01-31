/// <reference types="cypress"/>

describe('Edit Post', () => {
  context('With a registered user', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.contains('Sign In').click();
      cy.location('pathname').should('eq', '/signin');
      cy.get('input[name=email]').type("testuser@test.com");
      cy.get('input[name=pass]').type('pass1234');
      cy.intercept('POST', '/login', { statusCode: 200, fixture: 'verified_user.json' }).as('userLogin');
      cy.get('form').submit();
      cy.location('pathname').should('eq', '/');
      cy.get("a[href='/account']").click();
      cy.location('pathname').should('eq', '/account');
      cy.intercept('GET', '/posts', { statusCode: 200, fixture: 'posts_index.json' }).as('editPostIndex');
      cy.visit('/');
      cy.get('nav').should('include.text', 'testuser1');
    });

    it('does not show edit on a non-owned post', () => {
      // check that post ID 4 is not editable
    });

    it('allows a user to edit their post', () => {
      // check for post edit
    });
  })
}
