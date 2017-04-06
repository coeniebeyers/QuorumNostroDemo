import React, { PropTypes } from 'react'

const Node = ({ constellationAddress, name }) => (
  <li > { constellationAddress} | {name} </li>
)

Node.propTypes = {
  constellationAddress: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default Node
