/// <reference types="cypress" />

declare namespace Cypress {
  type Language = import('./types').Language;
  interface Chainable {
    login (username: string, password: string): Chainable<string>;
  }
}

export {}