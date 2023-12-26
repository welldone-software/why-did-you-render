it('Big list basic example', () => {
  cy.visitAndSpyConsole('/#bigList',console => {
    cy.contains('button', 'Increase!').click();

    expect(console.group).to.be.calledWithMatches([
      { match: 'BigList', times: 1 },
      { match: /props.*style\W/, times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because of props changes'], times: 1 },
    ]);
  });
});
