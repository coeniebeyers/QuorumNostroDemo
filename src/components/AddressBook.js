import React from 'react'
import AddAccount from '../containers/AddAccount'
import AccountList from '../containers/AccountList'
import AddContract from '../containers/AddContract'
import NavBar from '../components/NavBar'

const AddressBook = () => (
  <div>
    <NavBar />
    <AddAccount />
    <AccountList />
  </div>
)

export default AddressBook
