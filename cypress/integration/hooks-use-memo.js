it('Hooks - useMemo', () => {
  cy.visitAndSpyConsole('/#useMemo')

  cy.contains('button', 'count: 0').click()

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'ComponentWithAlwaysNewMemoResult', times: 1},
      {match: '[hook useMemo result]', times: 1}
    ])

    expect(console.log).to.be.calledWithMatches([
      {match: 'render ComponentWith', times: 4}
    ])
  })
})
