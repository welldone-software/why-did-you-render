import '@testing-library/jest-dom/extend-expect'

import {errorOnConsoleOutput} from '@welldone-software/jest-console-handler'

global.flushConsoleOutput = errorOnConsoleOutput()
