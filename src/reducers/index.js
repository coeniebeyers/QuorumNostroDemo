import { combineReducers } from 'redux'
import nostroAgreementList from './nostroAgreements'
import nostroBalanceList from './nostroBalances'
import accountList from './accounts'
import nodeList from './nodes'
import loadingIndicator from './loadingIndicator'

const nostroAccountManagmentApp = combineReducers({
  accountList,
  nodeList,
  nostroAgreementList,
  nostroBalanceList,
	loadingIndicator
})

export default nostroAccountManagmentApp
