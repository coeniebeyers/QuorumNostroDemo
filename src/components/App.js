import React from 'react'
import Footer from './Footer'
import AddAccount from '../containers/AddAccount'
import AccountList from '../containers/AccountList'
import NodeList from '../containers/NodeList'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddAccount />
    Account list:
    <AccountList />
    <br />
    Node list:
    <NodeList />
    <br />
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
