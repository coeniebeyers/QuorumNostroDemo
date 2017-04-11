import React from 'react'
import { Link } from 'react-router-dom'
const NavBar = props => {

  var ul = {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    backgroundColor: "#333"
	};

	var li = {
    float: "left",
    borderRight: "1px solid #bbb"
	};

  var li_a = {
    display: "block",
    color: "white",
    textAlign: "center",
    padding: "14px 16px",
    textDecoration: "none"
  };

	return (
		<div>
			<ul style={ul}>
				<li style={li}><Link to='/home' style={li_a}>Home</Link></li>
				<li style={li}><Link to='/address' style={li_a}>Address Book</Link></li>
				<li style={li}><Link to='/nostroAgreements' style={li_a}>Nostro Agreements</Link></li>
				<li style={li}><Link to='/topUpNostro' style={li_a}>Top-up Nostro Account</Link></li>
				<li style={li}><Link to='/counterparties' style={li_a}>Counterparties</Link></li>
				{props.children}
			</ul>
			<br />
		</div>
	)
}

export default NavBar
