import React from 'react'
import { connect } from 'react-redux'
import { addAccount } from '../actions'
import LoadingIndicator from '../containers/LoadingIndicator'

let AddAccount = ({ dispatch }) => {
  let input = null;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addAccount(input.value))
        input.value = ''
      }}>
        Account name: <input ref={accountName => {
          input = accountName
        }} />
        <button type="submit">
          Add Account
        </button>
				<LoadingIndicator />
      </form>
    </div>
  )
}
AddAccount = connect()(AddAccount)

export default AddAccount
