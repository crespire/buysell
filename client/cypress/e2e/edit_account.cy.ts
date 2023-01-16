/// <reference types="cypress"/>

describe('Edit User', () => {
  describe('After signing in, allows a user to edit their details', () => {
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
    })

    it('allows the user to change their username', () => {
      cy.get("input[name='name']").type('testuserupdate');
      cy.intercept('PATCH', '/account', { statusCode: 200, fixture: 'updated_name_user.json' }).as('userNameUpdate');
      cy.get('form').submit();
      cy.get('.authinfo').should('contain', 'Changes were successful!');
    });

    it('does not allow users to set an invalid username', () => {
      // Too short
      cy.get("input[name='name']").type('tu');
      cy.get("input[name='password']").type('somepassword12');
      cy.get('p.error').should('contain', 'Must be between 3 and 36 characters, and only contain word characters.');
      cy.get("button[type='submit'").click();
      cy.get('input:invalid').should('have.length', 1)
      cy.get("input[name='name']").clear();
      cy.get('p.error').should('not.exist');
      // Invalid character
      cy.get("input[name='name']").type('invalid!');
      cy.get("input[name='password']").clear().type('somepassword12');
      cy.get('p.error').should('contain', 'Must be between 3 and 36 characters, and only contain word characters.');
      cy.get("button[type='submit'").click();
      cy.get('input:invalid').should('have.length', 1)
      cy.get("input[name='name']").clear();
      cy.get('p.error').should('not.exist');
      // Too long
      cy.get("input[name='name'").type('averylongusernamethatshouldbetoolongyes');
      cy.get("input[name='password']").clear().type('somepassword12');
      cy.get('p.error').should('contain', 'Must be between 3 and 36 characters, and only contain word characters.');
      cy.get("button[type='submit'").click();
      cy.get('input:invalid').should('have.length', 1)
    });

    it('allows a user to change their password', () => {
      cy.get("input[name='password']").type('pass1234');
      cy.get("input[name='new-password']").type('password8');
      cy.get("input[name='passconf']").type('password8');
      cy.intercept('POST', '/change-password', { statusCode: 200, fixture: 'password_change_success.json' }).as('userPasswordSuccess');
      cy.get("button[type='submit'").click();
      cy.get('.authinfo').should('contain', 'Changes were successful!');
    });

    it('does not allow users to set a non-allowed password', () => {
      // Invalid password
      cy.get("input[name='password']").type('pass1234');
      cy.get("input[name='new-password']").type('password');
      cy.get("input[name='passconf']").type('password');
      cy.get('p.error').should('contain', 'Minimum length is 8, and must contain a digit.');
      cy.get("button[type='submit'").click();
      cy.get('input:invalid').should('have.length', 1)
      // Mismatched passwords
      cy.get("input[name='new-password']").clear();
      cy.get("input[name='passconf']").clear();
      cy.get('p.error').should('not.exist');
      cy.get("input[name='new-password']").type('password4');
      cy.get("input[name='passconf']").type('password2');
      cy.get('p.error').should('contain', 'Passwords must match.');
      cy.get("button[type='submit'").click();
      cy.get('input:invalid').should('have.length', 1)
    });
  });
});