import { connect } from 'react-redux'
import NostroBalanceList from '../components/NostroBalanceList'

const mapStateToProps = (state) => ({
  nostroBalanceList: state.nostroBalanceList
})

const NostroBalancesToDisplay = connect(
  mapStateToProps
)(NostroBalanceList)

export default NostroBalancesToDisplay
