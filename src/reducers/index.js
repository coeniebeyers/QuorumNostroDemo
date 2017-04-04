import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import accountList from './accounts'

const todoApp = combineReducers({
  todos,
  visibilityFilter,
  accountList
})

export default todoApp
