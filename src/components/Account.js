import React, { PropTypes } from 'react'

const Account = ({ accountName, accountAddress }) => (
  <li > { accountName } | {accountAddress} </li>
)

Account.propTypes = {
  accountName: PropTypes.string.isRequired
}

export default Account
