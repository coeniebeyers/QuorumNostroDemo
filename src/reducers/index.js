import { combineReducers } from 'redux'
import nostroAgreementList from './nostroAgreements'
import visibilityFilter from './visibilityFilter'
import accountList from './accounts'
import nodeList from './nodes'

const todoApp = combineReducers({
  visibilityFilter,
  accountList,
  nodeList,
  nostroAgreementList
})

export default todoApp
