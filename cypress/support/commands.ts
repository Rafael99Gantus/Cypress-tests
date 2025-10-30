/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/sign-in');
    cy.get('[data-cy="text"]').type(username);
    cy.get('[data-cy="password"]').type(password, { log: false }); // Нужно для отсутствия утчеки пароля в логи
    cy.contains('div', 'Remember me').find('[role="switch"]').click();
    cy.intercept('POST', '**/api/auth/login*').as('login');
    cy.contains('[role="button"]', 'Log in').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
});

export { };