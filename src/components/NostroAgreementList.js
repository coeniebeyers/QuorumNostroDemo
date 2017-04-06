import React, { PropTypes } from 'react'
import NostroAgreement from './NostroAgreement'

const NostroAgreementList = ({ nostroAgreementList }) => (
  <ul>
    {nostroAgreementList.map(nostroAgreement =>
      <NostroAgreement
        key={nostroAgreement.id}
        {...nostroAgreement}
      />
    )}
  </ul>
)

NostroAgreementList.propTypes = {
  nostroAgreementList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired).isRequired
}

export default NostroAgreementList
