describe('Main WDYR Scenarios', () => {
  it('Big list basic example', () => {
    cy.visitAndSpyConsole('/#bigList')
    cy.get('button').contains('Increase!').click()
    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'BigList', times: 1},
        {match: /props.*style/, times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because of props changes'], times: 1}
      ])
    })
  })

  it('props change', () => {
    cy.visitAndSpyConsole('/#propsChanges')
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 3},
        {match: /props.*a/, times: 2}
      ])
    })
  })
})
