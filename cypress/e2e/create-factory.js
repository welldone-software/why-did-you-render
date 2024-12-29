it('Creating react element using React.createFactory', () => {
  cy.visitAndSpyConsole('/#createFactory', console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'TestComponent', times: 1},
    ]);

    expect(console.log).to.be.calledWithMatches([
      {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1},
    ]);
  });
});
