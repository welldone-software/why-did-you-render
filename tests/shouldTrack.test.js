import React from 'react';

import shouldTrack from '../src/shouldTrack';
import whyDidYouRender from '../src';

class TrackedTestComponent extends React.Component {
  static whyDidYouRender = true
  render() {
    return <div>hi!</div>;
  }
}

class TrackedTestComponentNoHooksTracking extends React.Component {
  static whyDidYouRender = { trackHooks: false }
  render() {
    return <div>hi!</div>;
  }
}

class NotTrackedTestComponent extends React.Component {
  render() {
    return <div>hi!</div>;
  }
}

class ExcludedTestComponent extends React.Component {
  static whyDidYouRender = false
  render() {
    return <div>hi!</div>;
  }
}

class PureComponent extends React.PureComponent {
  render() {
    return <div>hi!</div>;
  }
}

const MemoComponent = React.memo(() => (
  <div>hi!</div>
));
MemoComponent.displayName = 'MemoComponent';

describe('shouldTrack', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  describe('component changes', () => {
    test('Do not track not tracked component (default)', () => {
      whyDidYouRender(React);
      const isShouldTrack = shouldTrack(NotTrackedTestComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(false);
    });

    test('Track tracked component', () => {
      whyDidYouRender(React);
      const isShouldTrack = shouldTrack(TrackedTestComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(true);
    });

    test('Track included not tracked components', () => {
      whyDidYouRender(React, {
        include: [/TestComponent/],
      });
      const isShouldTrack = shouldTrack(NotTrackedTestComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(true);
    });

    test('Dont track components with whyDidYouRender=false', () => {
      whyDidYouRender(React, {
        include: [/ExcludedTestComponent/],
      });
      const isShouldTrack = shouldTrack(ExcludedTestComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(false);
    });

    test('Do not track not included not tracked components', () => {
      whyDidYouRender(React, {
        include: [/0/],
      });
      const isShouldTrack = shouldTrack(NotTrackedTestComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(false);
    });

    test('Do not track excluded tracked components', () => {
      whyDidYouRender(React, {
        exclude: [/TrackedTestComponent/],
      });
      const isShouldTrack = shouldTrack(TrackedTestComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(false);
    });

    test('Pure component', () => {
      whyDidYouRender(React, {
        trackAllPureComponents: true,
      });
      const isShouldTrack = shouldTrack(PureComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(true);
    });

    test('Memo component', () => {
      whyDidYouRender(React, {
        trackAllPureComponents: true,
      });
      const isShouldTrack = shouldTrack(MemoComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(true);
    });

    test('Pure component excluded', () => {
      whyDidYouRender(React, {
        trackAllPureComponents: true,
        exclude: [/PureComponent/],
      });
      const isShouldTrack = shouldTrack(PureComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(false);
    });

    test('Memo component excluded', () => {
      whyDidYouRender(React, {
        trackAllPureComponents: true,
        exclude: [/MemoComponent/],
      });
      const isShouldTrack = shouldTrack(MemoComponent, { isHookChange: false });
      expect(isShouldTrack).toBe(false);
    });
  });

  describe('hooks changes', () => {
    test('Do not track not tracked component (default)', () => {
      whyDidYouRender(React);
      const isShouldTrack = shouldTrack(NotTrackedTestComponent, { isHookChange: true });
      expect(isShouldTrack).toBe(false);
    });

    test('Track tracked component', () => {
      whyDidYouRender(React);
      const isShouldTrack = shouldTrack(TrackedTestComponent, { isHookChange: true });
      expect(isShouldTrack).toBe(true);
    });

    test('Do not track hook changes with "trackHooks: false"', () => {
      whyDidYouRender(React);
      const isShouldTrack = shouldTrack(TrackedTestComponentNoHooksTracking, { isHookChange: true });
      expect(isShouldTrack).toBe(false);
    });
  });
});
