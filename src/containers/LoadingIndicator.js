import { connect } from 'react-redux'
import LoadingIndicator from '../components/LoadingIndicator'

const mapStateToProps = (state) => ({
  isLoading: state.loadingIndicator
})

const LoadingAccounts = connect(
  mapStateToProps
)(LoadingIndicator)

export default LoadingAccounts
