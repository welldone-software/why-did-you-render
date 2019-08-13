/*  eslint-disable no-console */
import normalizeOptions from './normalizeOptions'

test('Empty options works', () => {
  const options = normalizeOptions()
  expect(options.consoleLog).toBe(console.log)
})

test('User can rewrite options', () => {
  const ownNotifier = () => {}
  const userOptions = {
    notifier: ownNotifier
  }
  const options = normalizeOptions(userOptions)
  expect(options.notifier).toBe(ownNotifier)
  expect(options.consoleLog).toBe(console.log)
})
