import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import AddressBook from './components/AddressBook'
import Counterparties from './components/Counterparties'
import NostroAgreements from './components/NostroAgreements'
import reducer from './reducers'
import { pollNewNodes } from './actions'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

setInterval(function(){
  store.dispatch(pollNewNodes())
}, 1000)

render(
	<Provider store={store}>
		<HashRouter>
			<div>
				<Route exact path="/" component={AddressBook} />
				<Route path="/home" component={AddressBook} />
				<Route path="/address" component={AddressBook} />
				<Route path="/nostroAgreements" component={NostroAgreements} />
				<Route path="/counterparties" component={Counterparties} />
			</div>
		</HashRouter>
	</Provider>,
  document.getElementById('root')
)
