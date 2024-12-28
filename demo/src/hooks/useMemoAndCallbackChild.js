import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Hooks - useMemo and useCallback Child',
  fn({ reactDomRoot, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    const Comp = ({ useMemoFn, useCallbackFn }) => {
      const onClick = (...args) => {
        useMemoFn(...args);
        useCallbackFn(...args);
      };
      return <div onClick={onClick}>hi!</div>;
    };
    Comp.displayName = 'Comp';
    Comp.whyDidYouRender = true;

    const ComponentWithNewResultsForNewDeps = React.memo(({ count }) => {
      stepLogger('render component with always new results for new deps');

      const useMemoFn = React.useMemo(() => () => 'a', [count]);
      const useCallbackFn = React.useCallback(() => 'a', [count]);

      return (
        <Comp useMemoFn={useMemoFn} useCallbackFn={useCallbackFn}/>
      );
    });
    ComponentWithNewResultsForNewDeps.displayName = 'ComponentWithNewResultsForNewDeps';

    const ComponentWithNewResultsForDeepEqualsDeps = React.memo(({ count }) => {
      if (count === 0) {
        stepLogger('render component with always deep equals results - first render', false);
      } else {
        stepLogger('render component with always deep equals results - next render', true);
      }

      const useMemoFn = React.useMemo(() => () => 'a', [{ dep1: 'dep1' }]);
      const useCallbackFn = React.useCallback(() => 'a', [{ dep2: 'dep2' }]);

      return (
        <Comp useMemoFn={useMemoFn} useCallbackFn={useCallbackFn}/>
      );
    });
    ComponentWithNewResultsForDeepEqualsDeps.displayName = 'ComponentWithNewResultsForDeepEqualsDeps';

    function Main() {
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <button onClick={() => setCount(count + 1)}>
            Current count: {count}
          </button>
          <ComponentWithNewResultsForNewDeps count={count}/>
          <ComponentWithNewResultsForDeepEqualsDeps count={count}/>
        </div>
      );
    }

    Main.displayName = 'Main';

    reactDomRoot.render(<Main/>);
  },
};
