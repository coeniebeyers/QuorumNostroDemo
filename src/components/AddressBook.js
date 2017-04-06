import React from 'react'
import Footer from './Footer'
import AddAccount from '../containers/AddAccount'
import AccountList from '../containers/AccountList'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const AddressBook = () => (
  <div>
    <AddAccount />
    <AccountList />
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default AddressBook
