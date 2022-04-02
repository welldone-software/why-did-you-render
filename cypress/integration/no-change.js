it('No Changes', () => {
  cy.visitAndSpyConsole('/#noChanges', console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'ClassDemo', times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered although props and state objects are the same.'], times: 1 },
    ]);
  });
});
