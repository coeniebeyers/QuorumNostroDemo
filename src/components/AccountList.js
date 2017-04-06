import React, { PropTypes } from 'react'
import Account from './Account'

const AccountList = ({ accountList }) => (
  <ul>
    {accountList.map(account =>
      <Account
        key={account.id}
        {...account}
      />
    )}
  </ul>
)

AccountList.propTypes = {
  accountList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired).isRequired
}

export default AccountList
