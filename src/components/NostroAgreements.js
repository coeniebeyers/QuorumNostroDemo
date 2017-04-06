import React from 'react'
import AddContract from '../containers/AddContract'
import ContractList from '../containers/ContractList'
import NavBar from '../components/NavBar'

const Contracts = () => (
  <div>
    <NavBar />
    <AddContract />
    <ContractList />
  </div>
)

export default Contracts
