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
      cy.contains('Post From Another User').should('be.visible');
      cy.contains('By testuser2 posted on').should('not.contain.text', 'Edit');
    });

    it('allows a user to edit their post', () => {
      cy.contains('Post To Edit Title').should('be.visible');
      cy.intercept('GET', '/posts/3', { statusCode: 200, fixture: 'to_edit_post.json' }).as('editPostLoad');
      cy.contains('button', 'Edit').click();
      cy.location('pathname').should('eq', '/posts/3/edit');
      cy.contains('Edit Post').should('be.visible');
      cy.contains('Post To Edit Body').should('be.visible');
      cy.get("textarea[name='body']").type(' I have made an edit');
      cy.intercept('PATCH', '/posts/3', { statusCode: 200, fixture: 'edited_post.json' }).as('editedPostPatchResponse');
      cy.intercept('GET', '/posts/3', { statusCode: 200, fixture: 'edited_post.json' }).as('editedPostGet');
      cy.get('form').submit();
      cy.location('pathname').should('eq', '/posts/3');
      cy.get('p').should('include.text', 'I have made an edit');
    });

    it('prevents a user from editing a post to be invalid', () => {
      cy.contains('Post To Edit Title').should('be.visible');
      cy.intercept('GET', '/posts/3', { statusCode: 200, fixture: 'to_edit_post.json' }).as('editPostLoad');
      cy.contains('button', 'Edit').click();
      cy.location('pathname').should('eq', '/posts/3/edit');
      cy.contains('Edit Post').should('be.visible');
      cy.contains('Post To Edit Body').should('be.visible');
      cy.get("textarea[name='body']").clear().type('123');
      cy.get('input[name=title]').click();
      cy.contains('Body must be at least 5 characters long.').should('be.visible');
      cy.get("textarea[name='body']").clear().type('I have made an edit');
      cy.contains('Body must be at least 5 characters long.').should('not.exist');
      cy.get("input[name='title']").clear().type('12');
      cy.get("textarea[name='body']").click();
      cy.contains('Title must be at least 3 characters long.').should('be.visible');
      cy.get("input[name='title']").clear().type('Fixed title');
      cy.get('textarea').click();
      cy.contains('Title must be at least 3 characters long.').should('not.exist');
    });

    // Add a test for invalid edits
    // Add a test to add a file.
  });
});
