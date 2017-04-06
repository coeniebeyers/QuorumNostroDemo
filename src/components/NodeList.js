import React, { PropTypes } from 'react'
import Node from './Node'

const NodeList = ({ nodeList }) => (
  <ul>
    {nodeList.map(node =>
      <Node
        key={node.id}
        {...node}
      />
    )}
  </ul>
)

NodeList.propTypes = {
  nodeList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired).isRequired
}

export default NodeList
