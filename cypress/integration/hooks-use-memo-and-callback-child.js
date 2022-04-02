it('Hooks - useMemo and useCallback Child', () => {
  cy.visitAndSpyConsole('/#useMemoAndCallbackChild', console => {
    cy.contains('button', 'count: 0').click();

    expect(console.group).to.be.calledWithMatches([
      { match: 'Comp', times: 2 },
      { match: /useMemoFn/, times: 2 },
      { match: /useCallbackFn/, times: 2 },
      { match: /props.*\..*count/, times: 1 },
    ]);
  });
});
