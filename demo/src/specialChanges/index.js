import React from 'react';
import ReactDom from 'react-dom';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Special Changes',
  fn({ domElement, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true

      render() {
        return <div>Special Changes</div>;
      }
    }

    stepLogger('First render');
    ReactDom.render(
      <ClassDemo
        regEx={/something/}
        fn={function something() {}}
        date={new Date('6/29/2011 4:52:48 PM UTC')}
        reactElement={<div>hi!</div>}
      />,
      domElement
    );

    stepLogger('Same special props', true);
    ReactDom.render(
      <ClassDemo
        regEx={/something/}
        fn={function something() {}}
        date={new Date('6/29/2011 4:52:48 PM UTC')}
        reactElement={<div>hi!</div>}
      />,
      domElement
    );
  },
};
