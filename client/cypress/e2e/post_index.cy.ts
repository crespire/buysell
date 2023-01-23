/// <reference types="cypress"/>

describe('Post Index', () => {
  it('displays public posts', () => {
    cy.visit('/')
    cy.intercept('GET', '/posts', { statusCode: 200, fixture: 'posts_index.json' });
    cy.get('[data-testid="post-index"]').contains('Test Post 1 Body');
    cy.get('[data-testid="post-index"]').contains('Test Post 2 Body');
    cy.get('[data-testid="post-index"]').children().should('have.length', 2);
  });
});