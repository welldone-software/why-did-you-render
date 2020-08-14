describe('Main WDYR Scenarios', () => {
  it('Test console testing throws on wrong console appearance amounts', () => {
    cy.visitAndSpyConsole('/#bigList')
    cy.contains('button', 'Increase!').click()
    cy.getConsoleSpy(console => {

      expect(
        () => expect(console.group).to.be.calledWithMatches([
          {match: 'BigList', times: 0}
        ])
      ).to.throw()

      expect(
        () => expect(console.log).to.be.calledWithMatches([
          {match: [() => true, 'Re-rendered because of props changes'], times: 0}
        ])
      ).to.throw()
    })
  })

  it('Big list basic example', () => {
    cy.visitAndSpyConsole('/#bigList')
    cy.contains('button', 'Increase!').click()
    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'BigList', times: 1},
        {match: /props.*style\W/, times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because of props changes'], times: 1}
      ])
    })
  })

  it('props changes', () => {
    cy.visitAndSpyConsole('/#propsChanges')
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 3},
        {match: /props.*a\W/, times: 2}
      ])
    })
  })

  it('state changes', () => {
    cy.visitAndSpyConsole('/#stateChanges')
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 2},
        {match: /state.*objectKey\W/, times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the state object itself changed but its values are all equal'], times: 1}
      ])
    })
  })

  it('Child of Pure Component', () => {
    cy.visitAndSpyConsole('/#childOfPureComponent')

    cy.contains('button', 'clicks:').click()
    cy.contains('button', 'clicks:').click()

    cy.contains('button', 'clicks:').should('contain', '2')

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'PureFather', times: 2},
        {match: /props.*children\W/, times: 2}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: 'syntax always produces a *NEW* immutable React element', times: 2}
      ])
    })
  })

  it('Props And State Changes', () => {
    cy.visitAndSpyConsole('/#bothChanges')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 1},
        {match: /props.*a\W/, times: 1},
        {match: /state.*c\W/, times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: 'different objects that are equal by value.', times: 2}
      ])
    })
  })

  it('No Changes', () => {
    cy.visitAndSpyConsole('/#noChanges')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered although props and state objects are the same.'], times: 1}
      ])
    })
  })

  it('Special Changes', () => {
    cy.visitAndSpyConsole('/#specialChanges')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: 'different regular expressions with the same value.', times: 1},
        {match: 'different functions with the same name.', times: 1},
        {match: 'different date objects with the same value.', times: 1},
        {match: 'different React elements (remember that the <jsx/> syntax always produces a *NEW* immutable React element', times: 1}
      ])
    })
  })

  it('Server Side (hydrate)', () => {
    cy.visitAndSpyConsole('/#ssr')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'DemoComponent', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1}
      ])
    })
  })

  it('React Hot Reload Of Tracked Component', () => {
    cy.visitAndSpyConsole('/#hotReload')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'HotExportedDemoComponent', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1}
      ])
    })
  })

  it('Creating react element using React.createFactory', () => {
    cy.visitAndSpyConsole('/#createFactory')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'TestComponent', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1}
      ])
    })
  })

  it('Creating react element using React.cloneElement', () => {
    cy.visitAndSpyConsole('/#cloneElement')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'TestComponent', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1}
      ])
    })
  })

  it('Hooks - useState', () => {
    cy.visitAndSpyConsole('/#useState')

    cy.get('button:contains("Re-render")')
      .should('have.length', 4)
      .each($btn => {
        cy.wrap($btn).click()
      })

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'BrokenHooksPureComponent', times: 1},
        {match: 'BrokenHooksComponent', times: 1},
        {match: '[hook useState result]', times: 2}
      ])
    })
  })

  it('Hooks - useContext', () => {
    cy.visitAndSpyConsole('/#useContext')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: /ComponentWithContextHook$/, times: 2},
        {match: 'ComponentWithContextHookInsideMemoizedParent', times: 1},
        {match: '[hook useContext result]', times: 2}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1},
        {match: [() => true, 'Re-rendered because of hook changes'], times: 2}
      ])
    })
  })

  it('Hooks - useMemo', () => {
    cy.visitAndSpyConsole('/#useMemo')

    cy.contains('button', 'count: 0').click()

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ComponentWithAlwaysNewMemoResult', times: 1},
        {match: '[hook useMemo result]', times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: 'render ComponentWith', times: 4}
      ])
    })
  })

  it('Hooks - useReducer', () => {
    const checkConsole = times => cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'Main', times},
        {match: '[hook useReducer result]', times}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: 'different objects that are equal by value.', times}
      ])
    })

    cy.visitAndSpyConsole('/#useReducer')

    cy.contains('button', 'broken set count').click()

    checkConsole(1)

    cy.contains('button', 'broken set count').click()

    checkConsole(2)

    cy.contains('button', 'correct set count').click()

    checkConsole(2) // should not cause a re-render because of a current useRender user
  })

  it('Strict mode', () => {
    cy.visitAndSpyConsole('/#strict')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ClassDemo', times: 3},
        {match: /props.*a\W/, times: 2}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal.'], times: 1},
        {match: 'different objects that are equal by value', times: 2}
      ])
    })
  })

  it('React Redux', () => {
    const checkConsole = times => cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'ConnectedSimpleComponent', times},
        {match: '[hook useSelector result]', times}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because of hook changes'], times}
      ])
    })

    cy.visitAndSpyConsole('/#reactRedux')

    cy.contains('button', 'Same State').click()

    checkConsole(0)

    cy.contains('button', 'Deep Equal State').click()

    checkConsole(1)

    cy.contains('button', 'Deep Equal State').click()

    checkConsole(2)

    cy.contains('button', 'Random Object').click()

    checkConsole(2) // should not cause a re-render because the random object is different from the older one
  })

  it('React Redux HOC', () => {
    const checkConsole = times => cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'SimpleComponent', times},
        {match: /props.*a\W/, times}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because of props changes'], times},
        {match: 'different objects that are equal by value', times}
      ])
    })

    cy.visitAndSpyConsole('/#reactReduxHOC')

    cy.contains('button', 'Same State').click()

    checkConsole(0)

    cy.contains('button', 'Deep Equal State').click()

    checkConsole(1)

    cy.contains('button', 'Deep Equal State').click()

    checkConsole(2)

    cy.contains('button', 'Random Object').click()

    checkConsole(2) // should not cause a re-render because the random object is different from the older one
  })

  it('styled-components', () => {
    cy.visitAndSpyConsole('/#styledComponents')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.get('div:contains("styled-components")').last().should('have.css', 'background-color', 'rgb(255, 150, 174)')

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'Styled(SimpleComponent)', times: 1},
        {match: /props.*a\W/, times: 1}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because of props changes'], times: 1},
        {match: 'different objects that are equal by value', times: 1}
      ])
    })
  })

  it('Log Owner Reasons', () => {
    cy.visitAndSpyConsole('/#logOwnerReasons')

    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting

    cy.getConsoleSpy(console => {
      expect(console.group).to.be.calledWithMatches([
        {match: 'Child', times: 3},
        {match: 'Rendered by Owner', times: 1},
        {match: 'Rendered by ClassOwner', times: 1},
        {match: 'Rendered by HooksOwner', times: 1},
        {match: /props.*a\W/, times: 1},
        {match: '[hook useState result]', times: 2}
      ])

      expect(console.log).to.be.calledWithMatches([
        {match: [() => true, 'Re-rendered because the props object itself changed but its values are all equal'], times: 3},
        {match: [() => true, 'Re-rendered because of props changes'], times: 1},
        {match: [() => true, 'Re-rendered because of state changes'], times: 1},
        {match: [() => true, 'Re-rendered because of hook changes'], times: 2},
        {match: 'different objects.', times: 4}
      ])
    })
  })
})
