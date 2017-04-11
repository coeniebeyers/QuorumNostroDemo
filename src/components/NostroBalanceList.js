import React, { PropTypes } from 'react'
import NostroBalance from './NostroBalance'

// TODO: pull in the names FSR and JPM from a parameter
const NostroBalanceList = ({ nostroBalanceList }) => (
	<div>
		<h1>Welcome to the Nostro account management demonstration</h1>
		<table>
			<tr>
				<th>Owner</th>
				<th>Account</th>
				<th>Balance at FSR</th>
				<th>Balance at JPM</th>
			</tr>
			{nostroBalanceList.map(nostroBalance =>
				<NostroBalance key={nostroBalance.id} {...nostroBalance} />
			)}
		</table>
	</div>
)

NostroBalanceList.propTypes = {
  nostroBalanceList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired).isRequired
}

export default NostroBalanceList
