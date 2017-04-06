import React, { PropTypes } from 'react'

const Node = ({ constellationAddress }) => (
  <li > { constellationAddress} </li>
)

Node.propTypes = {
  constellationAddress: PropTypes.string.isRequired
}

export default Node
