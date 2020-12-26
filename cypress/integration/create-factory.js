it('Creating react element using React.createFactory', () => {
  cy.visitAndSpyConsole('/#createFactory');

  cy.wait(100); // eslint-disable-line cypress/no-unnecessary-waiting

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'TestComponent', times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1 },
    ]);
  });
});
