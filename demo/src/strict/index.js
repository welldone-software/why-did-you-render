import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Strict mode',
  fn({reactDomRoot, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true;
      render() {
        return <div>Props Changes</div>;
      }
    }

    const Main = props => (
      <React.StrictMode>
        <ClassDemo {...props}/>
      </React.StrictMode>
    );

    stepLogger('First render');
    reactDomRoot.render(<Main a={1} />);

    stepLogger('Same props', true);
    reactDomRoot.render(<Main a={1} />);

    stepLogger('Other props');
    reactDomRoot.render(<Main a={{b: 'b'}} />);

    stepLogger('Different by ref, equals by value', true);
    reactDomRoot.render(<Main a={{b: 'b'}} />);

    stepLogger('Other nested props');
    reactDomRoot.render(<Main a={{b: {c: {d: 'd'}}}} />);

    stepLogger('Deep equal nested props', true);
    reactDomRoot.render(<Main a={{b: {c: {d: 'd'}}}} />);
  },
};
