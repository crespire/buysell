describe('My First Test', () => {
  it('Visits the Home Page', () => {
    cy.visit('/')
    /**
     * cy.intercept('POST', '/posts', {
     *  statusCode: 201,
     *  body: {
     *    posts: 'Peter Pan',
     *  },
     * });
     */
    
  });
});