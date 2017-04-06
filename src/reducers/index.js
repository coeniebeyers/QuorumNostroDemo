import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import accountList from './accounts'
import nodeList from './nodes'

const todoApp = combineReducers({
  todos,
  visibilityFilter,
  accountList,
  nodeList
})

export default todoApp
