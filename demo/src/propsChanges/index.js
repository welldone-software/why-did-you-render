import React from 'react';
import ReactDom from 'react-dom';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Props Changes',
  fn({ domElement, whyDidYouRender }) {
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
    ReactDom.render(<Main a={1} />, domElement);

    stepLogger('Same props', true);
    ReactDom.render(<Main a={1} />, domElement);

    stepLogger('Other props');
    ReactDom.render(<Main a={{ b: 'b' }} />, domElement);

    stepLogger('Different by ref, equals by value', true);
    ReactDom.render(<Main a={{ b: 'b' }} />, domElement);

    stepLogger('Other nested props');
    ReactDom.render(<Main a={{ b: { c: { d: 'd' } } }} />, domElement);

    stepLogger('Deep equal nested props', true);
    ReactDom.render(<Main a={{ b: { c: { d: 'd' } } }} />, domElement);

    stepLogger('Mixed Props');
    ReactDom.render(<Main containerProps={{ style: { height: '100%' }, className: 'default-highchart' }} />, domElement);

    stepLogger('Mixed Props again', true);
    ReactDom.render(<Main containerProps={{ style: { height: '100%' }, className: 'default-highchart' }} />, domElement);

    const sameObj = { a: { b: 'c' } };

    stepLogger('Mixed Props including eq obj');
    ReactDom.render(<Main containerProps={{ style: { height: '100%' }, className: 'default-highchart', sameObj }} />, domElement);

    stepLogger('Mixed Props including eq obj', true);
    ReactDom.render(<Main containerProps={{ style: { height: '100%' }, className: 'default-highchart', sameObj }} />, domElement);
  },
};
