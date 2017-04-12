import React from 'react'
import SelectNostroAgreement from '../containers/SelectNostroAgreement'
import TopUpNostroForm from '../containers/TopUpNostroForm'
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
				</tbody>
			</table>
			<TopUpNostroForm />
		</div>
	)
}

export default TopUpNostro
