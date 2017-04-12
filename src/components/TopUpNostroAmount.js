import React, { PropTypes } from 'react'

const TopUpNostroAmount = ({ selectedNostroAgreement, onClickTopUpNostro }) => {
  let amountRequired = null;
  let amountToPay = null;

  function updateAmountToPay(){
		amountToPay.value = amountRequired.value * 10;
	}

  var fw = {
    width: "200"
	};

	return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!amountRequired.value.trim()) {
          return
        }
        onClickTopUpNostro(amountRequired.value, selectedNostroAgreement)
      }}>
				<table>
					<tbody>
						<tr>
							<td style={fw}>Amount Required (Currency1)</td>
							<td style={fw}>
								<input ref={ aReq => {amountRequired = aReq}} />
							</td>
						</tr>
						<tr>
							<td style={fw}>&nbsp;</td>
							<td style={fw}><button onClick={updateAmountToPay}>Request Rate</button></td>
						</tr>
						<tr>
							<td style={fw}>Amount to pay (Currency2)</td>
							<td style={fw}>
								<input ref={ aPay => {amountToPay = aPay}} />
							</td>
						</tr>
						<tr>
							<td style={fw}>&nbsp;</td>
							<td style={fw}>
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

TopUpNostroAmount.propTypes = {
  selectedNostroAgreement: PropTypes.string.isRequired,
  onClickTopUpNostro: PropTypes.func.isRequired
}

export default TopUpNostroAmount
