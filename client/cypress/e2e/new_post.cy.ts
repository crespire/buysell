/// <reference types="cypress"/>

describe('New Post', () => {
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
      cy.visit('/');
    })
  
    it('makes a new post with text only', () => {
      cy.get('nav').should('include.text', 'New Post');
      cy.contains('New Post').click();
      cy.location('pathname').should('eq', '/posts/new');
      cy.get("input[name='title']").type('Test Post');
      cy.get("textarea[name='body']").type('Test Post Body');
      cy.get("select[name='status'").select('Published');
      cy.intercept('POST', '/posts', { statusCode: 200, fixture: 'new_post.json' });
      cy.get('form').submit();
      cy.intercept('GET', '/posts', { statusCode: 200, fixture: 'new_post.json' });
      cy.location('pathname').should('eq', '/');
      cy.get('[data-testid="post-index"]').contains('Test 1 Title')
    });

    it('makes a new post with images', () => {
      cy.get('nav').should('include.text', 'New Post');
      cy.contains('New Post').click();
      cy.get("input[name='title']").type('Test Post With Image');
      cy.get("textarea[name='body']").type('Test Post With Image Body');
      cy.get("select[name='status']").select('Published');
      cy.get('input[type=file]').selectFile('cypress/fixtures/testimage.png');
      cy.intercept('POST', '/posts', { statusCode: 200, fixture: 'new_image_post.json' });
      cy.get('form').submit();
      cy.intercept('GET', '/posts', { statusCode: 200, fixture: 'new_image_post.json' });
      cy.location('pathname').should('eq', '/');
      cy.get('[data-testid="post-index"]').contains('Test Post With Image');
      cy.get("img[src='http://localhost:3000/testimage.png']").should('be.visible');
    });
  });  
});
