import React from 'react'
import AddNostroAgreement from '../containers/AddNostroAgreement'
import NostroAgreementList from '../containers/NostroAgreementList'
import NavBar from '../components/NavBar'

const NostroAgreements = () => (
  <div>
    <NavBar />
    <AddNostroAgreement />
    <NostroAgreementList />
  </div>
)

export default NostroAgreements
