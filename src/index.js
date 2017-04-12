import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import AddressBook from './components/AddressBook'
import Counterparties from './components/Counterparties'
import NostroAgreements from './components/NostroAgreements'
import TopUpNostro from './components/TopUpNostro'
import NostroBalances from './components/NostroBalances'
import reducer from './reducers'
import { pollNewNodes, 
  pollNostroAgreements, 
  pollNostroBalances, 
  getExistingAccounts 
} from './actions'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

store.dispatch(getExistingAccounts())
setInterval(function(){
  store.dispatch(pollNewNodes())
  store.dispatch(pollNostroAgreements())
  store.dispatch(pollNostroBalances())
}, 1000)

render(
	<Provider store={store}>
		<HashRouter>
			<div>
				<Route exact path="/" component={NostroBalances} />
				<Route path="/home" component={NostroBalances} />
				<Route path="/address" component={AddressBook} />
				<Route path="/nostroAgreements" component={NostroAgreements} />
				<Route path="/topUpNostro" component={TopUpNostro} />
				<Route path="/counterparties" component={Counterparties} />
			</div>
		</HashRouter>
	</Provider>,
  document.getElementById('root')
)
