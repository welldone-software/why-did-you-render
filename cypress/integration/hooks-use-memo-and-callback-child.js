it('Hooks - useMemo and useCallback Child', () => {
  cy.visitAndSpyConsole('/#useMemoAndCallbackChild')

  cy.contains('button', 'count: 0').click()

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'Comp', times: 1},
      {match: /useMemoFn/, times: 2},
      {match: /useCallbackFn/, times: 2},
      {match: /props.*\..*count/, times: 1}
    ])
  })
})
