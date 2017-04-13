import { connect } from 'react-redux'
import { topUpNostro } from '../actions'
import TopUpNostroAmount from '../components/TopUpNostroAmount'

const mapStateToProps = (state) => ({
	selectedNostroAgreement: state.selectedNostroAgreement
})

const mapDispatchToProps = {
  onClickTopUpNostro: topUpNostro
}

const TopUpNostroForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopUpNostroAmount)

export default TopUpNostroForm
