it('Hooks - useContext', () => {
  cy.visitAndSpyConsole('/#useContext')

  cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: /ComponentWithContextHook$/, times: 2},
      {match: 'ComponentWithContextHookInsideMemoizedParent', times: 1},
      {match: '[hook useContext result]', times: 2}
    ])

    expect(console.log).to.be.calledWithMatches([
      {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1},
      {match: [() => true, 'Re-rendered because of hook changes'], times: 2}
    ])
  })
})
