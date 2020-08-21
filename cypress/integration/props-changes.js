it('props changes', () => {
  cy.visitAndSpyConsole('/#propsChanges')
  cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'ClassDemo', times: 5},
      {match: 'Rendered by Main', times: 5},
      {match: /props.*a\W/, times: 4},
      {match: /props.*containerProps\W/, times: 4}
    ])
  })
})
