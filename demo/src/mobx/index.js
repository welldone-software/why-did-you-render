import React from 'react';
import ReactDom from 'react-dom';
import _ from 'lodash';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

export default {
  description: 'Mobx',
  fn({ domElement, whyDidYouRender }) {
    whyDidYouRender(React);
  
    class TestStore {
      state = { nested: { value: '0' } };

      constructor() {
        makeAutoObservable(this);
      }

      increaseCount() {
        this.state.nested.value++;
      }

      deepEqualsCount() {
        this.state = _.cloneDeep(this.state);
      }
    }

    const SimpleComponent = ({ testStore }) => {
      // eslint-disable-next-line no-console
      console.log('re-render!');

      return (
        <div>
          <span>count: {testStore.state.nested.value}</span>
          <button onClick={() => testStore.increaseCount()}>
            Increase
          </button>
          <button onClick={() => testStore.deepEqualsCount()}>
            deep Equals
          </button>
        </div>
      );
    };

    const ObservedSimpleComponent = observer(SimpleComponent);

    SimpleComponent.whyDidYouRender = true;
    ObservedSimpleComponent.whyDidYouRender = true;

    const testStore = new TestStore();

    const Main = () => (
      <ObservedSimpleComponent testStore={testStore}/>
    );

    ReactDom.render(<Main/>, domElement);
  },
};
