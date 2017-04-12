import { combineReducers } from 'redux'
import nostroAgreementList from './nostroAgreements'
import nostroBalanceList from './nostroBalances'
import accountList from './accounts'
import nodeList from './nodes'
import selectedNostroAgreement from './selectNostroAgreement'
import loadingIndicator from './loadingIndicator'

const nostroAccountManagmentApp = combineReducers({
  accountList,
  nodeList,
  nostroAgreementList,
  nostroBalanceList,
  selectedNostroAgreement,
	loadingIndicator
})

export default nostroAccountManagmentApp
