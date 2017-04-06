import { combineReducers } from 'redux'
import nostroAgreementList from './nostroAgreements'
import accountList from './accounts'
import nodeList from './nodes'
import loadingIndicator from './loadingIndicator'

const nostroAccountManagmentApp = combineReducers({
  accountList,
  nodeList,
  nostroAgreementList,
	loadingIndicator
})

export default nostroAccountManagmentApp
