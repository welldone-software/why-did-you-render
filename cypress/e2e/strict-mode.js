it('Strict mode', () => {
  cy.visitAndSpyConsole('/#strict', console => {
    expect(console.group).to.be.calledWithMatches([
      {match: 'ClassDemo', times: 3},
      {match: 'Rendered by Main', times: 3},
      {match: /props.*a\W/, times: 4},
    ]);

    expect(console.log).to.be.calledWithMatches([
      {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 2},
      {match: 'different objects that are equal by value', times: 4},
    ]);
  });
});
