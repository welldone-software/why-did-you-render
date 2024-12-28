import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Special Changes',
  fn({ reactDomRoot, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true;

      render() {
        return <div>Special Changes</div>;
      }
    }

    stepLogger('First render');
    reactDomRoot.render(
      <ClassDemo
        regEx={/something/}
        fn={function something() {}}
        date={new Date('6/29/2011 4:52:48 PM UTC')}
        reactElement={<div>hi!</div>}
      />
    );

    stepLogger('Same special props', true);
    reactDomRoot.render(
      <ClassDemo
        regEx={/something/}
        fn={function something() {}}
        date={new Date('6/29/2011 4:52:48 PM UTC')}
        reactElement={<div>hi!</div>}
      />
    );
  },
};
