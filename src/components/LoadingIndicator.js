import React, { PropTypes } from 'react'

const LoadingIndicator = ({ isLoading }) => (
  <span>
    {
			isLoading === "false" ? 
				"" : 
		  	<img src={require('./images/ajax-loader.gif')} alt="loading..." />
		}
  </span>
)

LoadingIndicator.propTypes = {
  isLoading: PropTypes.string.isRequired
}

export default LoadingIndicator
