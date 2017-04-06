import React from 'react'
import { connect } from 'react-redux'
import { addContract } from '../actions'

let AddContract = ({ dispatch }) => {
  let input = null;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addContract(input.value))
        input.value = ''
      }}>
        Contract name: <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Contract
        </button>
      </form>
    </div>
  )
}
AddContract = connect()(AddContract)

export default AddContract
