import React from 'react'
import SelectNostroAgreement from '../containers/SelectNostroAgreement'
import NavBar from '../components/NavBar'

const TopUpNostro = () => {

  var fw = {
    width: "200"
	};

	return (
		<div>
			<NavBar />
			<table>
				<tbody>
					<tr>
						<td style={fw}>Nostro Agreement</td>
						<td style={fw}><SelectNostroAgreement /></td>
					</tr>
					<tr>
						<td style={fw}>Amount Required (Currency1)</td>
						<td style={fw}><input /></td>
					</tr>
					<tr>
						<td style={fw}>&nbsp;</td>
						<td style={fw}><button>Request Rate</button></td>
					</tr>
					<tr>
						<td style={fw}>Amount to pay (Currency2)</td>
						<td style={fw}>0</td>
					</tr>
					<tr>
						<td style={fw}>&nbsp;</td>
						<td style={fw}><button>Top up Nostro Account</button></td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default TopUpNostro
