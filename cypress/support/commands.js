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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('visitAndSpyConsole', (...args) => {
  cy.visit(...args)
  cy.window()
    .then((win) => {
      cy.spy(win.console, 'log')
      cy.spy(win.console, 'group')
    })
})

Cypress.Commands.add('getConsoleSpy', cb => {
  cy.window()
    .then((win) => {
      cb(win.console)
    })
})
