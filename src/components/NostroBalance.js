import React, { PropTypes } from 'react'

// TODO: This assumes a single nostro agreement for now
// TODO: Add the counterparties to this agreement, e.g. this is a FSR-JPM agreement
const NostroBalance = ({ nostroBalance }) => {

  var rightAlign = {
		textAlign: "right"
	};

	return (
		<tr>
			<td> { nostroBalance.owner.name } </td> 
			<td> { nostroBalance.address } </td> 
			<td style={rightAlign}> 
				{ nostroBalance.balances[0].currency1Balance } &nbsp;  
				{ nostroBalance.balances[0].currency1Name} 
			</td>
			<td style={rightAlign}> 
				{ nostroBalance.balances[0].currency2Balance } &nbsp; 
				{ nostroBalance.balances[0].currency2Name} 
			</td>
		</tr>
	)
}

NostroBalance.propTypes = {
  nostroBalance: PropTypes.object.isRequired
}

export default NostroBalance
