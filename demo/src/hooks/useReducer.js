/* eslint-disable no-console */
import React from 'react';

export default {
  description: 'Hooks - useReducer',
  fn({ reactDomRoot, whyDidYouRender }) {
    whyDidYouRender(React);

    function reducer(state, action) {
      switch (action.type) {

      case 'broken-set-count':
        return { count: action.payload.count };

      case 'set-count':
        if (action.payload.count === state.count) {
          return state;
        }
        return { count: action.payload.count };
      }
    }

    const initialState = { count: '0' };

    function Main() {
      const [state, dispatch] = React.useReducer(reducer, initialState);
      const inputRef = React.createRef();

      return (
        <div>
          <p>current count: {state.count}</p>
          <input ref={inputRef} defaultValue="0"/>
          <button
            onClick={() => dispatch({
              type: 'broken-set-count',
              payload: { count: inputRef.current.value },
            })}
          >
            broken set count
          </button>
          <button
            onClick={() => dispatch({
              type: 'set-count',
              payload: { count: inputRef.current.value },
            })}
          >
            correct set count
          </button>
          <br />
          <button onClick={() => console.clear()}>clear console</button>
        </div>
      );
    }
    Main.whyDidYouRender = true;

    reactDomRoot.render(<Main/>);
  },
};
