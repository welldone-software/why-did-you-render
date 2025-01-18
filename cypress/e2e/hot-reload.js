it('React Hot Reload Of Tracked Component', () => {
  cy.visitAndSpyConsole('/#hotReload', console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'HotExportedDemoComponent', times: 1},
    ]);

    expect(console.log).to.be.calledWithMatches([
      {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1},
    ]);
  });
});
