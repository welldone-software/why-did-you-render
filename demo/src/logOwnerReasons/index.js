import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Log Owner Reasons',
  fn({reactDomRoot, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    const Child = () => null;
    Child.whyDidYouRender = true;

    const Owner = () => <Child />;

    class ClassOwner extends React.Component {
      state = {a: 1};
      componentDidMount() {
        this.setState({a: 2});
      }

      render() {
        return <Child />;
      }
    }

    function HooksOwner() {
      /* eslint-disable no-unused-vars */
      const [a, setA] = React.useState(1);
      const [b, setB] = React.useState(1);
      /* eslint-enable */
      React.useEffect(() => {
        setA(2);
        setB(2);
      }, []);

      return <Child />;
    }

    stepLogger('First render');
    reactDomRoot.render(<Owner a={1} />);

    stepLogger('Owner props change', true);
    reactDomRoot.render(<Owner a={2} />);

    stepLogger('Owner state change', true);
    reactDomRoot.render(<ClassOwner />);

    stepLogger('Owner hooks changes', true);
    reactDomRoot.render(<HooksOwner />);
  },
};
