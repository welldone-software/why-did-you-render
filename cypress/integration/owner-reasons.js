it('Log Owner Reasons', () => {
  cy.visitAndSpyConsole('/#logOwnerReasons');

  cy.wait(100); // eslint-disable-line cypress/no-unnecessary-waiting

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'Child', times: 3 },
      { match: 'Rendered by Owner', times: 1 },
      { match: 'Rendered by ClassOwner', times: 1 },
      { match: 'Rendered by HooksOwner', times: 1 },
      { match: /props.*a\W/, times: 1 },
      { match: '[hook useState result]', times: 2 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal'], times: 3 },
      { match: [() => true, 'Re-rendered because of props changes'], times: 1 },
      { match: [() => true, 'Re-rendered because of state changes'], times: 1 },
      { match: [() => true, 'Re-rendered because of hook changes'], times: 2 },
      { match: 'different objects.', times: 4 },
    ]);
  });
});
