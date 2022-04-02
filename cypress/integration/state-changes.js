it('state changes', () => {
  cy.visitAndSpyConsole('/#stateChanges', console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'ClassDemo', times: 2 },
      { match: /state.*objectKey\W/, times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because the state object itself changed but its values are all equal'], times: 1 },
    ]);
  });
});
