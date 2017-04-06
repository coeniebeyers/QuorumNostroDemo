import React, { PropTypes } from 'react'

const NostroAgreement = ({ nostroAgreement }) => (
  <li > 
    { nostroAgreement.counterparties[0].name}| 
    { nostroAgreement.counterparties[1].name}| 
    { nostroAgreement.currency1.name } 
    { nostroAgreement.currency2.name } 
  </li>
)

NostroAgreement.propTypes = {
  nostroAgreement: PropTypes.object.isRequired
}

export default NostroAgreement
