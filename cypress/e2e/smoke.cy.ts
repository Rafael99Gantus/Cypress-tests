/// <reference types="cypress" />

describe('Smoke', () => {
  it('opens base URL and has a title', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
  });
});