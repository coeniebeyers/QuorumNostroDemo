import { connect } from 'react-redux'
import NostroAgreementList from '../components/NostroAgreementList'

const mapStateToProps = (state) => ({
  nostroAgreementList: state.nostroAgreementList
})

const NostroAgreementsToDisplay = connect(
  mapStateToProps
)(NostroAgreementList)

export default NostroAgreementsToDisplay
