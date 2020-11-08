import * as React from 'react'

import wdyrStore from './wdyrStore'

import whyDidYouRender, {storeOwnerData, getWDYRType} from './whyDidYouRender'
import defaultNotifier from './defaultNotifier'

whyDidYouRender.defaultNotifier = defaultNotifier
whyDidYouRender.wdyrStore = wdyrStore
whyDidYouRender.storeOwnerData = storeOwnerData
whyDidYouRender.getWDYRType = getWDYRType
Object.assign(whyDidYouRender, React)

export default whyDidYouRender
