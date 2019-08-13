export class UnexpectedConsoleOutput extends Error{
  constructor(message, consoleMessages){
    super(`${message}: ${JSON.stringify(consoleMessages, null, 2)}`)
    this.consoleMessages = consoleMessages
  }
}

export default function errorOnConsoleOutput(){
  let consoleMessages = []

  beforeEach(() => {
    Object.keys(global.console)
      .filter(consoleFnName => {
        return consoleFnName.charAt(0) !== '_' && typeof(global.console[consoleFnName]) === 'function'
      })
      .forEach(consoleFnName => {
        global.console[consoleFnName] = (...args) => {
          consoleMessages.push({level: consoleFnName, args})
        }
      })
  })

  afterEach(() => {
    if(consoleMessages.length > 0){
      throw new UnexpectedConsoleOutput('Unhandled console messages in test', consoleMessages)
    }
  })

  const flushConsoleMessages = () => {
    const consoleMessagesToTake = consoleMessages
    consoleMessages = []
    return consoleMessagesToTake
  }

  return flushConsoleMessages
}
