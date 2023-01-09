/// <reference types="cypress"/>

describe('Edit User', () => {
  describe('After signing in, allows a user to edit their details', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.contains('Sign In').click();
      cy.location('pathname').should('eq', '/signin');
      cy.get('input[name=email]').type("testuser@test.com");
      cy.get('input[name=pass]').type('pass1234');
      cy.intercept('POST', '/login', { fixture: 'verified_user.json' }).as('userLogin');
      cy.get('form').submit();
      cy.location('pathname').should('eq', '/');
    })

    it('allows the user to change their username', () => {
      cy.get("a[href='/account']").click();
      cy.location('pathname').should('eq', '/account');
    });

    it.skip('does not allow users to set a non-allowed username', () => {
      // test with an invalid user name
    });

    it.skip('allows a user to change their password', () => {
      // test with a valid password
    });

    it.skip('does not allow users to set a non-allowed password', () => {
      // test with an invalid password
    });
  });
});