it('Strict mode', () => {
  cy.visitAndSpyConsole('/#strict')

  cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'ClassDemo', times: 3},
      {match: 'Rendered by Main', times: 3},
      {match: /props.*a\W/, times: 4}
    ])

    expect(console.log).to.be.calledWithMatches([
      {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 2},
      {match: 'different objects that are equal by value', times: 4}
    ])
  })
})
