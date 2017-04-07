import React, { PropTypes } from 'react'

const LoadingIndicator = ({ isLoading }) => (
  <div>
    {isLoading === "false" ? "" : "creating account on blockchain..."}
  </div>
)

LoadingIndicator.propTypes = {
  isLoading: PropTypes.string.isRequired
}

export default LoadingIndicator
