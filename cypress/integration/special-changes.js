it('Special Changes', () => {
  cy.visitAndSpyConsole('/#specialChanges');

  cy.wait(100); // eslint-disable-line cypress/no-unnecessary-waiting

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'ClassDemo', times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: 'different regular expressions with the same value.', times: 1 },
      { match: 'different functions with the same name.', times: 1 },
      { match: 'different date objects with the same value.', times: 1 },
      { match: 'different React elements (remember that the <jsx/> syntax always produces a *NEW* immutable React element', times: 1 },
    ]);
  });
});
