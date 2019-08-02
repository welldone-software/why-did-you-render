/* eslint-disable no-console */
import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from './index'

describe('index', () => {
  let updateInfos = []
  beforeEach(() => {
		jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
		jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())
    updateInfos = []
    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo)
    })
  })

  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__()
  })

  test('dont swallow errors', () => {
		const BrokenComponent = React.memo(null)
    BrokenComponent.whyDidYouRender = true

		const mountBrokenComponent = () => {
      rtl.render(
        <BrokenComponent/>
      )
    }

    expect(mountBrokenComponent).toThrow('Cannot read property \'propTypes\' of null')
		expect(console.error).toHaveBeenCalled()
		expect(console.log).toHaveBeenCalled()
  })
})
