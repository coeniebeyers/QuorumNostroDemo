import React, { PropTypes } from 'react'

const NostroAgreement = ({ nostroAgreement }) => (
  <li > 
    { nostroAgreement.counterpartiesToCurrency1[0].name }: &nbsp; 
    { nostroAgreement.currency2 } | &nbsp;
    { nostroAgreement.counterpartiesToCurrency2[0].name }: &nbsp;
    { nostroAgreement.currency1 } 
  </li>
)

NostroAgreement.propTypes = {
  nostroAgreement: PropTypes.object.isRequired
}

export default NostroAgreement
