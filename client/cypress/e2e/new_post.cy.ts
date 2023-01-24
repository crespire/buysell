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
      cy.get('nav').should('include.text', 'New Post');
      cy.contains('New Post').click();
    })
  
    it('makes a new post with text only', () => {
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
      cy.location('pathname').should('eq', '/posts/new');
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

    it('does not allow malformed posts', () => {
      cy.location('pathname').should('eq', '/posts/new');
      // Title too short
      cy.get("input[name='title']").type('tu');
      cy.get("textarea[name='body'").click();
      cy.get('p.error').should('contain', 'Title must be at least 3 characters long.');
      cy.get("button[type='submit'").click();
      cy.get('input:invalid').should('have.length', 1)
      cy.get("input[name='title']").clear();
      cy.get("input[name='title']").type('Proper Title');
      cy.get('p.error').should('not.exist');
      // Body too short
      cy.get("textarea[name='body']").type('tu');
      cy.get("input[name='title'").click();
      cy.get('p.error').should('contain', 'Body must be at least 5 characters long.');
      cy.get("textarea[name='body']").clear();
      cy.get("textarea[name='body']").type('A proper post body.');
      cy.get('p.error').should('not.exist');
      /*
       * HTML File Inputs 'accept' attribute only sets the default
       * file type selected in the file explorer dialogue and does
       * not prevent the user from selecting "All Files" and uploading
       * the wrong mime-type file.
       * 
       * Attachments should be verified on the server.
       */
    });
  });  
});
