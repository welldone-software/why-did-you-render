/*  eslint-disable no-console */
import React from 'react'
import normalizeOptions from './normalizeOptions'

describe('normalizeOptions', () => {
  test('Empty options works', () => {
    const options = normalizeOptions(undefined, React)
    expect(options.consoleLog).toBe(console.log)
  })

  test('User can rewrite options', () => {
    const ownNotifier = () => {}
    const userOptions = {
      notifier: ownNotifier
    }
    const options = normalizeOptions(userOptions, React)
    expect(options.notifier).toBe(ownNotifier)
    expect(options.consoleLog).toBe(console.log)
  })
})
