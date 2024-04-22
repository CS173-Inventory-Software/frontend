describe('hardware - viewer', () => {
  beforeEach(() => {
    cy.login('viewer@mail.com');
  });

  it('gets the hardware page', () => {
    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.contains('Hardware');
  });

  it('can not see Create New Hardware button', () => {
    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.contains('Create New Hardware').should('not.exist');
  });

  it('can navigate to a hardware page', () => {
    cy.intercept('GET', '/hardware-instance/*').as('get-hardware');
    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.wait('@get-hardware');
    cy.get('tr td:nth-child(2) a').first().click();
  });

  it('can not see the submit button', () => {
    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.get('tr td:nth-child(2) a').first().click();
    cy.contains('Submit').should('not.exist');
  });

  it('can not see the instance add/delete buttons', () => {
    cy.intercept('GET', '/hardware/*/').as('get-hardware');

    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.get('tr td:nth-child(2) a').first().click();

    cy.wait('@get-hardware').its('response.statusCode').should('eq', 200);

    cy.get('.instance-add-button').should('not.exist');
    cy.get('.instance-delete-button').should('not.exist');
  });
});

