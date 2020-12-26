it('Server Side (hydrate)', () => {
  cy.visitAndSpyConsole('/#ssr');

  cy.contains('hydrated hi');

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'DemoComponent', times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1 },
    ]);
  });
});
