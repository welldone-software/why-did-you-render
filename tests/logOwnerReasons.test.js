import React from 'react';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import { diffTypes } from '~/consts';

let updateInfos = [];

beforeEach(() => {
  updateInfos = [];
  whyDidYouRender(React, {
    notifier: updateInfo => updateInfos.push(updateInfo),
  });
});

afterEach(() => {
  if (React.__REVERT_WHY_DID_YOU_RENDER__) {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  }
});

function createOwners(Child) {
  const FunctionalOwner = () => <Child />;

  class ClassOwner extends React.Component {
    state = { a: 1 };
    componentDidMount() {
      this.setState({ a: 2 });
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

  return { FunctionalOwner, ClassOwner, HooksOwner };
}

function CloneOwner({ children }) {
  /* eslint-disable no-unused-vars */
  const [a, setA] = React.useState(1);
  const [b, setB] = React.useState(1);
  /* eslint-enable */
  React.useEffect(() => {
    setA(2);
    setB(2);
  }, []);

  return React.cloneElement(children);
}

describe('logOwnerReasons - function child', () => {
  const Child = () => null;
  Child.whyDidYouRender = true;

  const { FunctionalOwner, ClassOwner, HooksOwner } = createOwners(Child);

  test('owner props changed', () => {
    const { rerender } = rtl.render(<FunctionalOwner a={1}/>);
    rerender(<FunctionalOwner a={2} />);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2,
        }],
        stateDifferences: false,
        hookDifferences: false,
      },
    });
  });

  test('owner state changed', () => {
    rtl.render(<ClassOwner/>);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2,
        }],
        hookDifferences: false,
      },
    });
  });

  test('owner hooks changed', () => {
    rtl.render(<HooksOwner/>);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2,
            }],
          },
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2,
            }],
          },
        ],
      },
    });
  });

  test('owner state updated during render', () => {
    function DerivedStateOwner({ ready }) {
      const [wasReady, setWasReady] = React.useState(ready);
      if (ready && !wasReady) {
        setWasReady(true);
      }

      return <Child />;
    }
    const { rerender } = rtl.render(<DerivedStateOwner ready={false}/>);
    rerender(<DerivedStateOwner ready/>);
    rerender(<DerivedStateOwner ready={false}/>);

    expect(updateInfos).toHaveLength(2);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: [{
          pathString: 'ready',
          diffType: diffTypes.different,
          prevValue: false,
          nextValue: true,
        }],
        stateDifferences: false,
        hookDifferences: [
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: false,
              nextValue: true,
            }],
          },
        ],
      },
    });
    expect(updateInfos[1].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: [{
          pathString: 'ready',
          diffType: diffTypes.different,
          prevValue: true,
          nextValue: false,
        }],
        stateDifferences: false,
        hookDifferences: [{ hookName: 'useState', differences: false }],
      },
    });
  });

  test('owner uses cloneElement', () => {
    rtl.render(<CloneOwner><Child/></CloneOwner>);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2,
            }],
          },
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2,
            }],
          },
        ],
      },
    });
  });
});


describe('logOwnerReasons - class child', () => {
  class Child extends React.Component {
    static whyDidYouRender = true;
    render() {
      return null;
    }
  }

  const { FunctionalOwner, ClassOwner, HooksOwner } = createOwners(Child);

  test('owner props changed', () => {
    const { rerender } = rtl.render(<FunctionalOwner a={1}/>);
    rerender(<FunctionalOwner a={2} />);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2,
        }],
        stateDifferences: false,
        hookDifferences: false,
      },
    });
  });

  test('owner state changed', () => {
    rtl.render(<ClassOwner/>);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2,
        }],
        hookDifferences: false,
      },
    });
  });

  test('owner hooks changed', () => {
    rtl.render(<HooksOwner/>);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2,
            }],
          },
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2,
            }],
          },
        ],
      },
    });
  });
});
