import { connect } from 'react-redux'
import { updateSelectedNostroAgreement } from '../actions'
import SelectNostroDropDown from '../components/SelectNostroDropDown'

const formatNostroAgreementListForDropDown = (nostroAgreementList) => {
	console.log('nostroAgreementList:', nostroAgreementList);
	//TODO: Need to map the nostro agreements to an array containing value and label
	return [
		{value: "1234", label:"JPM USD/ZAR agreement"}
	]
}

const mapStateToProps = (state) => ({
  nostroAgreements: formatNostroAgreementListForDropDown(state.nostroAgreementList),
	selectedNostroAgreement: state.selectedNostroAgreement
})

const mapDispatchToProps = {
  onNostroSelect: updateSelectedNostroAgreement
}

const SelectNostroAgreement = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectNostroDropDown)

export default SelectNostroAgreement
