import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import App from './components/App'
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
				<Route exact path="/" component={App} />
				<Route path="/home" component={App} />
			</div>
		</HashRouter>
	</Provider>,
  document.getElementById('root')
)
