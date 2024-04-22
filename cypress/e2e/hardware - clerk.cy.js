describe('hardware - clerk', () => {
  beforeEach(() => {
    cy.login('clerk@mail.com');
  });

  it('gets the hardware page', () => {
    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.contains('Hardware');
  });

  it('can not see Create New Hardware button', () => {
    cy.visit(Cypress.env('base_url') + '/hardware');
    cy.contains('Create New Hardware').should('not.exist');
  });

  it('can not edit hardware', () => {
    cy.visit(Cypress.env('base_url') + '/hardware/2');
    cy.intercept('GET', '/hardware/*/').as('get-hardware');
    cy.wait('@get-hardware').its('response.statusCode').should('eq', 200);

    cy.get('#name').should('have.attr', 'readonly');
    cy.get('#brand').should('have.attr', 'readonly');
    cy.get('#model_number').should('have.attr', 'readonly');
    cy.get('#description').should('have.attr', 'readonly');
  });

  it.only('can not edit hardware instances except ', () => {
    cy.visit(Cypress.env('base_url') + '/hardware/2');
    cy.intercept('GET', '/hardware/*/').as('get-hardware');
    cy.intercept('PUT', '/hardware/*').as('put-hardware');
    cy.wait('@get-hardware').its('response.statusCode').should('eq', 200);

    cy.get('#serial_number-0').should('have.attr', 'readonly');
    cy.get('#procurement_date-0').should('have.attr', 'readonly');
    cy.get('#status-0').should('have.attr', 'readonly');

    cy.get('#assignee-0').click();
    cy.get('#assignee-0_list li').first().click();
    cy.get('#for_deletion').click();
    cy.get('button[type="submit"]').click();

    cy.wait('@put-hardware').its('response.statusCode').should('eq', 200);
  });
});