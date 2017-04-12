import React from 'react'
import { connect } from 'react-redux'
import { addNostroAgreement } from '../actions'

// TODO: this should be split in two
// 1) add a nostro agreement specifying currency
// 2) send a request to the counterparty, requesting their approval of the agreement

// TODO: the counterparty input should populate from a list of available counterparties
// TODO: remove the input field where ZAR will be entered, this should be filled in on the Home page along with the node name

let AddNostroAgreement = ({ dispatch }) => {
  let counterparty = null;
  let currency1 = null;
  let currency2 = null;

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!counterparty.value.trim()) {
          return
        }
        if (!currency1.value.trim()) {
          return
        }
        if (!currency2.value.trim()) {
          return
        }
        var obj = {
          counterparty: counterparty.value,
          currency1: currency1.value,
          currency2: currency2.value
        } 
        dispatch(addNostroAgreement(obj))
        counterparty.value = ''
        currency1.value = ''
        currency2.value = ''
      }}>
				<table>
					<tbody>
						<tr>
							<td>
								Counterparty name
							</td>
							<td>
								<input ref={node => {counterparty = node}} />
							</td>
						</tr>
						<tr>
							<td>
								Currency offered
							</td>
							<td>
								<input ref={node => {currency1 = node}} />
							</td>
						</tr>
						<tr>
							<td>
								Currency required
							</td>
							<td>
								<input ref={node => {currency2 = node}} />
							</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td>
								<button type="submit">Add Nostro Agreement</button>
							</td>
						</tr>
					</tbody>
				</table>
      </form>
    </div>
  )
}
AddNostroAgreement = connect()(AddNostroAgreement)

export default AddNostroAgreement
