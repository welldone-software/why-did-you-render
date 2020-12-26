it('Test console testing throws on wrong console appearance amounts', () => {
  cy.visitAndSpyConsole('/#bigList');
  cy.contains('button', 'Increase!').click();
  cy.getConsoleSpy(console => {

    expect(
      () => expect(console.group).to.be.calledWithMatches([
        { match: 'BigList', times: 0 },
      ])
    ).to.throw();

    expect(
      () => expect(console.log).to.be.calledWithMatches([
        { match: [() => true, 'Re-rendered because of props changes'], times: 0 },
      ])
    ).to.throw();
  });
});
