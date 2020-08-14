it('Hooks - useReducer', () => {
  const checkConsole = times => cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'Main', times},
      {match: '[hook useReducer result]', times}
    ])

    expect(console.log).to.be.calledWithMatches([
      {match: 'different objects that are equal by value.', times}
    ])
  })

  cy.visitAndSpyConsole('/#useReducer')

  cy.contains('button', 'broken set count').click()

  checkConsole(1)

  cy.contains('button', 'broken set count').click()

  checkConsole(2)

  cy.contains('button', 'correct set count').click()

  checkConsole(2) // should not cause a re-render because of a current useRender user
})
