import React from 'react'
import AddAccount from '../containers/AddAccount'
import AccountList from '../containers/AccountList'
import NavBar from '../components/NavBar'
import LoadingIndicator from '../containers/LoadingIndicator'

const AddressBook = () => (
  <div>
    <NavBar />
    <AddAccount />
    <LoadingIndicator />
    <AccountList />
  </div>
)

export default AddressBook
