it('props changes', () => {
  cy.visitAndSpyConsole('/#propsChanges')
  cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'ClassDemo', times: 3},
      {match: 'Rendered by Main', times: 3},
      {match: /props.*a\W/, times: 4}
    ])
  })
})
