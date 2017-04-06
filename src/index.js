import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import AddressBook from './components/AddressBook'
import Contracts from './components/Contracts'
import reducer from './reducers'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

render(
	<Provider store={store}>
		<HashRouter>
			<div>
				<Route exact path="/" component={AddressBook} />
				<Route path="/home" component={AddressBook} />
				<Route path="/address" component={AddressBook} />
				<Route path="/contract" component={Contracts} />
			</div>
		</HashRouter>
	</Provider>,
  document.getElementById('root')
)
