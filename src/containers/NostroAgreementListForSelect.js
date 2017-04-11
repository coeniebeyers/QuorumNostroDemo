import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select';

let SelectNostroAgreement = ({ state }) => {
  function updateSelectedNostroAgreement(selectedValue){
    this.setState({
      selectedNostroAgreement: selectedValue
    });
	};	

  return (
		<Select ref="nostroSelect" autofocus options={state.nostroAgreementList} simpleValue name="selected-nostro" value={state.selectedNostroAgreement} onChange={this.updateSelectedNostroAgreement(this.updateValue)} />
  )
}
SelectNostroAgreement = connect()(SelectNostroAgreement)

export default SelectNostroAgreement
