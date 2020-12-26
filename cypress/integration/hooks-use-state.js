it('Hooks - useState', () => {
  cy.visitAndSpyConsole('/#useState');

  cy.get('button:contains("Re-render")')
    .should('have.length', 4)
    .each($btn => {
      cy.wrap($btn).click();
    });

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'BrokenHooksPureComponent', times: 2 },
      { match: '[hook useState result]', times: 2 },
    ]);
  });
});
