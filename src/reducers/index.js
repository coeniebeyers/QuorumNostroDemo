import { combineReducers } from 'redux'
import nostroAgreements from './nostroAgreements'
import visibilityFilter from './visibilityFilter'
import accountList from './accounts'
import nodeList from './nodes'

const todoApp = combineReducers({
  visibilityFilter,
  accountList,
  nodeList,
  nostroAgreements
})

export default todoApp
