import React, { PropTypes } from 'react'
import Select from 'react-select';

const SelectNostroDropDown = ({ nostroAgreements, selectedNostroAgreement, onNostroSelect }) => (
	<Select autofocus options={nostroAgreements} simpleValue name="selected-nostro" value={selectedNostroAgreement} onChange={onNostroSelect} />
)

SelectNostroDropDown.propTypes = {
  nostroAgreements: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired).isRequired,
  selectedNostroAgreement: PropTypes.string.isRequired,
  onNostroSelect: PropTypes.func.isRequired
}

export default SelectNostroDropDown
