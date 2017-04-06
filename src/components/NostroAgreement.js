import React, { PropTypes } from 'react'

const NostroAgreement = ({ nostroAgreement }) => (
  <li > { nostroAgreement } </li>
)

NostroAgreement.propTypes = {
  nostroAgreement: PropTypes.string.isRequired
}

export default NostroAgreement
