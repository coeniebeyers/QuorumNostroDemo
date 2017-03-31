import React, { PropTypes } from 'react'

const Todo = ({ onClick, active, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: active ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Todo
