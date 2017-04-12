import { connect } from 'react-redux'
import { updateSelectedNostroAgreement } from '../actions'
import SelectNostroDropDown from '../components/SelectNostroDropDown'

const formatNostroAgreementListForDropDown = (nostroAgreementList) => {
  var options=[];

	for(var index=0; index<nostroAgreementList.length; index++){
		var ag=nostroAgreementList[index];
		options.push({
			value: ag.id,
			label: ag.counterpartiesToCurrency1[0].name + ': ' + ag.currency2 + ' | ' + ag.counterpartiesToCurrency2[0].name + ': ' + ag.currency1
		});
	}
	console.log('options:', options);
	return options;
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
