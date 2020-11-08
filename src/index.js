import wdyrStore from './wdyrStore'

import whyDidYouRender, {storeOwnerData, getWDYRType} from './whyDidYouRender'
import defaultNotifier from './defaultNotifier'

whyDidYouRender.defaultNotifier = defaultNotifier
whyDidYouRender.wdyrStore = wdyrStore
whyDidYouRender.storeOwnerData = storeOwnerData
whyDidYouRender.getWDYRType = getWDYRType

export default whyDidYouRender
