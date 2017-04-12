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
			<p>Top up Nostro screen</p> 
			<div style={fw}>
				<SelectNostroAgreement />
			</div>
		</div>
	)
}

export default TopUpNostro
