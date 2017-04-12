import React from 'react'
import { connect } from 'react-redux'
import { addAccount } from '../actions'

let TopUpNostroForm = ({ dispatch }) => {
  let amountRequired = "0";
  let amountToPay = "0";

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!amountRequired.value.trim()) {
          return
        }
        dispatch(addAccount("1234"))
      }}>
				<table>
					<tbody>
						<tr>
							<td>Amount Required (Currency1)</td>
							<td>
								<input ref={ aReq => {amountRequired = aReq}} />
							</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td><button>Request Rate</button></td>
						</tr>
						<tr>
							<td>Amount to pay (Currency2)</td>
							<td>{amountToPay}</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td>
								<button type="submit">
									Top up Nostro Account
								</button>
							</td>
						</tr>
					</tbody>
				</table>
      </form>
    </div>
  )
}
TopUpNostroForm = connect()(TopUpNostroForm)

export default TopUpNostroForm
