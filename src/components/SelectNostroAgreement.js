import React, { PropTypes } from 'react'
import Select from 'react-select';

const SelectNostroAgreement = ({ selectedNostroAgreement, nostroAgreementList, updateSelectedNostroAgreement }) => (
  <Select ref="stateSelect" autofocus options={nostroAgreementList} simpleValue name="selected-nostro" value={selectedNostroAgreement} onChange={updateSelectedNostroAgreement(this.updateValue)} />
)

SelectNostroAgreement.propTypes = {
  nostroAgreementList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired).isRequired
}

export default SelectNostroAgreement

