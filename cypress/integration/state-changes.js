it('state changes', () => {
  cy.visitAndSpyConsole('/#stateChanges');
  cy.wait(100); // eslint-disable-line cypress/no-unnecessary-waiting
  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'ClassDemo', times: 2 },
      { match: /state.*objectKey\W/, times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because the state object itself changed but its values are all equal'], times: 1 },
    ]);
  });
});
