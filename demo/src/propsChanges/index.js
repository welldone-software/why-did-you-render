import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Props Changes',
  fn({reactDomRoot, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    const ClassDemo = () => (
      <div>Props Changes</div>
    );
    ClassDemo.whyDidYouRender = true;

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

    stepLogger('Mixed Props');
    reactDomRoot.render(<Main containerProps={{style: {height: '100%'}, className: 'default-highchart'}} />);

    stepLogger('Mixed Props again', true);
    reactDomRoot.render(<Main containerProps={{style: {height: '100%'}, className: 'default-highchart'}} />);

    const sameObj = {a: {b: 'c'}};

    stepLogger('Mixed Props including eq obj');
    reactDomRoot.render(<Main containerProps={{style: {height: '100%'}, className: 'default-highchart', sameObj}} />);

    stepLogger('Mixed Props including eq obj', true);
    reactDomRoot.render(<Main containerProps={{style: {height: '100%'}, className: 'default-highchart', sameObj}} />);
  },
};
