describe('react-redux', () => {
  it('React Redux', () => {
    const checkConsole = (console, times) => {
      expect(console.group).to.be.calledWithMatches([
        { match: 'ConnectedSimpleComponent', times },
        { match: '[hook useSelector result]', times },
      ]);

      expect(console.log).to.be.calledWithMatches([
        { match: [() => true, 'Re-rendered because of hook changes'], times },
      ]);
    };

    cy.visitAndSpyConsole('/#reactRedux', console => {
      cy.contains('button', 'Same State').click();

      checkConsole(console, 0);
  
      cy.contains('button', 'Deep Equal State').click();
  
      checkConsole(console, 1);
  
      cy.contains('button', 'Deep Equal State').click();
  
      checkConsole(console, 2);
  
      cy.contains('button', 'Random Object').click();
  
      checkConsole(console, 2); // should not cause a re-render because the random object is different from the older one
    });
  });

  it('React Redux HOC', () => {
    const checkConsole = (console, times) => {
      expect(console.group).to.be.calledWithMatches([
        { match: 'SimpleComponent', times: times * 2 },
        { match: /props.*a\W/, times },
      ]);

      expect(console.log).to.be.calledWithMatches([
        { match: [() => true, 'Re-rendered because of props changes'], times },
        { match: 'different objects that are equal by value', times },
      ]);
    };

    cy.visitAndSpyConsole('/#reactReduxHOC', console => {
      cy.contains('button', 'Same State').click();

      checkConsole(console, 0);
  
      cy.contains('button', 'Deep Equal State').click();
  
      checkConsole(console, 1);
  
      cy.contains('button', 'Deep Equal State').click();
  
      checkConsole(console, 2);
  
      cy.contains('button', 'Random Object').click();
  
      checkConsole(console, 2); // should not cause a re-render because the random object is different from the older one
    });
  });
});
