/// <reference types="cypress"/>

describe('New Post', () => {
  context('With a registered user', () => {
    before(() => {
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
      cy.visit('/');
    })
  
    it('makes a new post with text only', () => {
      // expect new post button
      // click new post
      // expect path to be
      // fill in form with text only
      // cy.intercept('POST', '/posts', { statusCode: 200, fixture: 'posts.json' });
      // visit 
    });

    it.skip('makes a new post with images', () => {
      //
    });
  });  
});