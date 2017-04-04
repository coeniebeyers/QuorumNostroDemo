import { connect } from 'react-redux'
import AccountList from '../components/AccountList'

const mapStateToProps = (state) => ({
  accountList: state.accountList
})

const AccountsToDisplay = connect(
  mapStateToProps
)(AccountList)

export default AccountsToDisplay
