/* eslint-disable no-unused-vars */
import React from 'react';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import {diffTypes} from '~/consts';

describe('opaqueOverride', () => {
  let updateInfos = [];

  beforeEach(() => {
    updateInfos = [];
  });

  afterEach(() => {
    if (React.__REVERT_WHY_DID_YOU_RENDER__) {
      React.__REVERT_WHY_DID_YOU_RENDER__();
    }
  });

  test('treats objects as opaque when opaqueOverride returns true', () => {
    // Simulate Reanimated SharedValue
    const createSharedValue = (value) => ({
      _isReanimatedSharedValue: true,
      value,
      // These should never be accessed due to opaqueOverride
      get: () => { throw new Error('Should not access SharedValue internals'); },
      set: () => { throw new Error('Should not access SharedValue internals'); },
    });

    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      opaqueOverride: (obj) => obj && obj._isReanimatedSharedValue === true,
    });

    const sharedValue1 = createSharedValue(1);
    const sharedValue2 = createSharedValue(1); // Same value but different reference

    const Component = ({sharedProp}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const {rerender} = rtl.render(<Component sharedProp={sharedValue1} />);

    // Rerender with different SharedValue reference
    rerender(<Component sharedProp={sharedValue2} />);

    // Should detect as different because they're different references
    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason.propsDifferences).toEqual([{
      pathString: 'sharedProp',
      diffType: diffTypes.different,
      prevValue: sharedValue1,
      nextValue: sharedValue2,
    }]);
  });

  test('detects no change when same opaque reference is passed', () => {
    // Track if internal data is accessed
    let dataAccessed = false;
    const createOpaqueObject = (id) => ({
      _opaque: true,
      id,
      // Should never be accessed when using opaqueOverride
      get data() {
        dataAccessed = true;
        return 'internal-data';
      },
    });

    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      opaqueOverride: (obj) => obj && obj._opaque === true,
    });

    const opaqueObj = createOpaqueObject('test');

    const Component = ({opaqueProp, regularProp}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const {rerender} = rtl.render(
      <Component opaqueProp={opaqueObj} regularProp={1} />
    );

    // Rerender with same opaque reference but different regular prop
    rerender(<Component opaqueProp={opaqueObj} regularProp={2} />);

    // Verify internal data was never accessed
    expect(dataAccessed).toBe(false);

    // Should only detect regularProp change
    expect(updateInfos).toHaveLength(1);

    // Filter out "same" differences for the assertion
    const actualDifferences = updateInfos[0].reason.propsDifferences.filter(
      diff => diff.diffType !== diffTypes.same
    );

    expect(actualDifferences).toEqual([{
      pathString: 'regularProp',
      diffType: diffTypes.different,
      prevValue: 1,
      nextValue: 2,
    }]);
  });

  test('handles transition from undefined to opaque object', () => {
    const createSharedValue = (value) => ({
      _isReanimatedSharedValue: true,
      value,
    });

    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      opaqueOverride: (obj) => obj && obj._isReanimatedSharedValue === true,
    });

    const Component = ({sharedProp}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const {rerender} = rtl.render(<Component sharedProp={undefined} />);

    const sharedValue = createSharedValue(1);
    rerender(<Component sharedProp={sharedValue} />);

    // Should detect change from undefined to SharedValue
    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason.propsDifferences).toEqual([{
      pathString: 'sharedProp',
      diffType: diffTypes.different,
      prevValue: undefined,
      nextValue: sharedValue,
    }]);
  });

  test('handles transition from opaque object to regular value', () => {
    const createSharedValue = (value) => ({
      _isReanimatedSharedValue: true,
      value,
    });

    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      opaqueOverride: (obj) => obj && obj._isReanimatedSharedValue === true,
    });

    const Component = ({sharedProp}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const sharedValue = createSharedValue(1);
    const {rerender} = rtl.render(<Component sharedProp={sharedValue} />);

    rerender(<Component sharedProp="regular string" />);

    // Should detect change from SharedValue to string
    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason.propsDifferences).toEqual([{
      pathString: 'sharedProp',
      diffType: diffTypes.different,
      prevValue: sharedValue,
      nextValue: 'regular string',
    }]);
  });

  test('opaqueOverride works with nested properties', () => {
    const createSharedValue = (value) => ({
      _isReanimatedSharedValue: true,
      value,
    });

    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      opaqueOverride: (obj) => obj && obj._isReanimatedSharedValue === true,
    });

    const sharedValue1 = createSharedValue(1);
    const sharedValue2 = createSharedValue(2);

    const Component = ({config}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const {rerender} = rtl.render(
      <Component config={{animation: sharedValue1, speed: 100}} />
    );

    // Change nested SharedValue
    rerender(<Component config={{animation: sharedValue2, speed: 100}} />);

    // Should detect the nested SharedValue change
    expect(updateInfos).toHaveLength(1);
    const diffs = updateInfos[0].reason.propsDifferences;

    // The config object itself changed
    expect(diffs.find(d => d.pathString === 'config')).toBeTruthy();

    // The nested animation property changed (different SharedValue references)
    const animationDiff = diffs.find(d => d.pathString === 'config.animation');
    expect(animationDiff).toEqual({
      pathString: 'config.animation',
      diffType: diffTypes.different,
      prevValue: sharedValue1,
      nextValue: sharedValue2,
    });
  });

  test('opaque values are not accessed when logged to console', () => {
    let accessCount = 0;
    const createTrackedSharedValue = (value) => ({
      _isReanimatedSharedValue: true,
      get value() {
        accessCount++;
        return value;
      },
      // Other properties that should never be accessed
      get _value() {
        throw new Error('Should not access internal _value');
      },
    });

    const consoleLogs = [];
    whyDidYouRender(React, {
      consoleLog: (...args) => consoleLogs.push(args),
      consoleGroup: () => {},
      consoleGroupEnd: () => {},
      logOnDifferentValues: true,
      opaqueOverride: (obj) => obj && obj._isReanimatedSharedValue === true,
    });

    const sharedValue1 = createTrackedSharedValue(1);
    const sharedValue2 = createTrackedSharedValue(2);

    const Component = ({sharedProp}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const {rerender} = rtl.render(<Component sharedProp={sharedValue1} />);
    rerender(<Component sharedProp={sharedValue2} />);

    // Check that logs contain safe representations
    const logStrings = JSON.stringify(consoleLogs);
    expect(logStrings).toContain('[Opaque Reference object]');

    // Verify that the value getter was never called during logging
    expect(accessCount).toBe(0);
  });

  test('without opaqueOverride, objects are compared deeply', () => {
    // Without opaqueOverride, this would normally try to access properties
    const obj1 = {
      _isReanimatedSharedValue: true,
      value: 1,
    };
    const obj2 = {
      _isReanimatedSharedValue: true,
      value: 1,
    };

    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      // No opaqueOverride specified
    });

    const Component = ({prop: _prop}) => {
      return <div>Test</div>;
    };
    Component.whyDidYouRender = true;

    const {rerender} = rtl.render(<Component prop={obj1} />);
    rerender(<Component prop={obj2} />);

    // Without opaqueOverride, it compares deeply and finds them equal
    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason.propsDifferences).toEqual([{
      pathString: 'prop',
      diffType: diffTypes.deepEquals,
      prevValue: obj1,
      nextValue: obj2,
    }]);
  });
});
