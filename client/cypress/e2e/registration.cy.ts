describe('My First Test', () => {
  it('Visits the Home Page', () => {
    cy.visit('/')
    cy.intercept('GET', '/posts', {
      statusCode: 200,
      body: [
        {
          'id': 1,
          'title': 'Test 1 Title',
          'body': 'Test Post 1 Body',
          'created_at': 'Rails date string created_at',
          'updated_at': 'Rails date string updated_at',
          'status': 2,
          'account': {
            'name': 'user1',
            id: 1
          },
          'images': [],
        },
        {
          'id': 2,
          'title': 'Test 2 Title',
          'body': 'Test Post 2 Body',
          'created_at': 'Rails date string created_at',
          'updated_at': 'Rails date string updated_at',
          'status': 2,
          'account': {
            'name': 'user1',
            id: 1
          },
          'images': [],
        }
      ],
    });
    cy.get('[data-testid="post-index"]').contains('Test Post 1 Body');
    cy.get('[data-testid="post-index"]').contains('Test Post 2 Body');
    cy.get('[data-testid="post-index"]').children().should('have.length', 2);
  });
});