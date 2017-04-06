import React from 'react'
import { connect } from 'react-redux'
import { addNostroAgreement } from '../actions'

let AddNostroAgreement = ({ dispatch }) => {
  let input = null;
  let input2 = null;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        if (!input2.value.trim()) {
          return
        }
        dispatch(addNostroAgreement(input.value +' | '+ input2.value))
        input.value = ''
        input2.value = ''
      }}>
        Bank name: <input ref={node => {
          input = node
        }} />
        <br />
        Currency pair: <input ref={node => {
          input2 = node
        }} />
        <br />
        <button type="submit">
          Add Nostro Agreement
        </button>
      </form>
    </div>
  )
}
AddNostroAgreement = connect()(AddNostroAgreement)

export default AddNostroAgreement
