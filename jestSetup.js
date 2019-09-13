import {errorOnConsoleOutput} from '@welldone-software/jest-console-handler'

global.flushConsoleOutput = errorOnConsoleOutput()
