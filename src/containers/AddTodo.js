import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
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
        dispatch(addTodo(input.value +' | '+ input2.value))
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
AddTodo = connect()(AddTodo)

export default AddTodo
