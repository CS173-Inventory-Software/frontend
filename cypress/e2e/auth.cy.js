describe('login', () => {
  it('gets the login page', () => {
    cy.visit(Cypress.env('base_url'));
  });

  it('successfully logs in', () => {
    cy.intercept('POST', '/request-code/').as('request-code');

    cy.visit(Cypress.env('base_url'));

    cy.get('#email-input').type('root@mail.com');
    cy.get('#code-send-button').click();

    cy.wait('@request-code').its('response.statusCode').should('eq', 200);

    cy.get('@request-code').then(req => {

      cy.get('#code-input').type(req.response.body.code);
      cy.get('#submit').click();

      cy.contains('Reports');

    });
  });
});