/* eslint-disable no-console */
import React from 'react';
import ReactDom from 'react-dom';
import createStepLogger from '../createStepLogger';

export default {
  description: 'Hooks - useContext',
  fn({ domElement, whyDidYouRender }) {
    whyDidYouRender(React);

    const stepLogger = createStepLogger();

    const MyContext = React.createContext({ c: 'c' });

    let alreadyMountedComponentWithContextHook = false;
    function ComponentWithContextHook() {
      if (alreadyMountedComponentWithContextHook) {
        stepLogger('renders ComponentWithContextHook with deep equal context', true);
      } else {
        alreadyMountedComponentWithContextHook = true;
      }

      const currentContext = React.useContext(MyContext);

      return (
        <p>{currentContext.c}</p>
      );
    }
    ComponentWithContextHook.whyDidYouRender = true;

    let alreadyMountedComponentWithContextHookInsideMemoizedParent = false;
    function ComponentWithContextHookInsideMemoizedParent() {
      if (alreadyMountedComponentWithContextHookInsideMemoizedParent) {
        stepLogger('renders ComponentWithContextHookInsideMemoizedParent with deep equal context', true);
      } else {
        alreadyMountedComponentWithContextHookInsideMemoizedParent = true;
      }

      const currentContext = React.useContext(MyContext);

      return (
        <p>{currentContext.c}</p>
      );
    }
    ComponentWithContextHookInsideMemoizedParent.whyDidYouRender = true;

    const MemoizedParent = React.memo(() => (
      <div>
        <ComponentWithContextHookInsideMemoizedParent/>
      </div>
    ));

    MemoizedParent.dispalyName = 'MemoizedParent';
    MemoizedParent.whyDidYouRender = true;

    let alreadyMountedMain = false;
    function Main() {
      const [currentState, setCurrentState] = React.useState({ c: 'context value' });

      if (alreadyMountedMain) {
        stepLogger('renders Main and it would trigger the render of ComponentWithContextHook because it\'s not pure', true);
      } else {
        alreadyMountedMain = true;
      }

      React.useLayoutEffect(() => {
        setCurrentState({ c: 'context value' });
      }, []);

      return (
        <MyContext.Provider value={currentState}>
          <h3>
            {`While somehow weird, we have two notifications for "ComponentWithContextHook"
            since it is re-rendered regardless of context changes because "Main" is
            re-rendered and ComponentWithContextHook is not pure`}
          </h3>
          <div>
            ComponentWithContextHook
            <ComponentWithContextHook />
            <br/>
            <br/>
            MemoizedParent
            <MemoizedParent />
          </div>
        </MyContext.Provider>
      );
    }

    stepLogger('initial render');
    ReactDom.render(<Main/>, domElement);
  },
};
