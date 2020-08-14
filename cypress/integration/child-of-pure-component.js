it('Child of Pure Component', () => {
  cy.visitAndSpyConsole('/#childOfPureComponent')

  cy.contains('button', 'clicks:').click()
  cy.contains('button', 'clicks:').click()

  cy.contains('button', 'clicks:').should('contain', '2')

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'PureFather', times: 2},
      {match: /props.*children\W/, times: 2}
    ])

    expect(console.log).to.be.calledWithMatches([
      {match: 'syntax always produces a *NEW* immutable React element', times: 2}
    ])
  })
})
