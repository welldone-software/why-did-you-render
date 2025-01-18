import React from 'react';

export default {
  description: 'forwardRef',
  fn({reactDomRoot, whyDidYouRender}) {
    whyDidYouRender(React);

    const Main = React.forwardRef((props, ref) => {
      return <div ref={ref}>hi</div>;
    });

    Main.whyDidYouRender = true;

    Main.displayName = 'Main';

    const App = () => {
      const [,setState] = React.useState(0);
      
      React.useLayoutEffect(() => {
        setState(s => s + 1);
      }, []);

      return <Main a={[]}/>;
    };

    App.displayName = 'App';

    reactDomRoot.render(<App/>);
  },
};
