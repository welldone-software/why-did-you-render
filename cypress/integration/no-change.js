it('No Changes', () => {
  cy.visitAndSpyConsole('/#noChanges');

  cy.wait(100); // eslint-disable-line cypress/no-unnecessary-waiting

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'ClassDemo', times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered although props and state objects are the same.'], times: 1 },
    ]);
  });
});
