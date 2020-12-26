it('styled-components', () => {
  cy.visitAndSpyConsole('/#styledComponents');

  cy.wait(100); // eslint-disable-line cypress/no-unnecessary-waiting

  cy.get('div:contains("styled-components")').last().should('have.css', 'background-color', 'rgb(255, 150, 174)');

  cy.getConsoleSpy(console => {
    expect(console.group).to.be.calledWithMatches([
      { match: 'Styled(SimpleComponent)', times: 1 },
      { match: /props.*a\W/, times: 1 },
    ]);

    expect(console.log).to.be.calledWithMatches([
      { match: [() => true, 'Re-rendered because of props changes'], times: 1 },
      { match: 'different objects that are equal by value', times: 1 },
    ]);
  });
});
