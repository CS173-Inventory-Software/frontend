// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', email => {
  cy.session([email], () => {
    cy.intercept('POST', '/request-code/').as('request-code');

    cy.visit(Cypress.env('base_url'));

    cy.get('#email-input').type(email);
    cy.get('#code-send-button').click();

    cy.wait('@request-code').its('response.statusCode').should('eq', 200);

    cy.get('@request-code').then(req => {

      cy.get('#code-input').type(req.response.body.code);
      cy.get('#submit').click();

      cy.contains('Reports');
    });
  });
});