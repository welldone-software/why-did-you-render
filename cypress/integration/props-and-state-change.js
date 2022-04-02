it('Props And State Changes', () => {
  cy.visitAndSpyConsole('/#bothChanges', console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'ClassDemo', times: 1 },
      { match: /props.*a\W/, times: 1 },
      { match: /state.*c\W/, times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: 'different objects that are equal by value.', times: 2 },
    ]);
  });
});
