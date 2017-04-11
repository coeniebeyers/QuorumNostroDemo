const nostroBalance = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_NOSTROBALANCE':
      return {
        id: action.id,
        nostroBalance: action.nostroBalance
      }
    default:
      return state
  }
}

function balanceIsUpdated(currState, action){
  if(Number(currState.nostroBalance.balances[0].currency1Balance) !==
    Number(action.nostroBalance.balances[0].currency1Balance)){
    return true;
  } else if(Number(currState.nostroBalance.balances[0].currency2Balance) !==
    Number(action.nostroBalance.balances[0].currency2Balance)){
    return true;
  } else {
    return false;
  }
}

const nostroBalanceList = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_NOSTROBALANCE':
      // Work on a copy of the state!!
      let newState = state.slice()
      let newBalance = true
      for(let i = 0; i < newState.length; i++){
        let currState = newState[i]
        if(currState.nostroBalance.address === action.nostroBalance.address){
          newBalance = false;
          if(balanceIsUpdated(currState, action)){
            newState[i] = nostroBalance(undefined, action)
          }
        } 
      }
      if(newBalance === true){
        newState.push(nostroBalance(undefined, action))
      }
      return newState
    case 'REQUEST_NEW_NOSTROBALANCE':
    default:
      return state
  }
}

export default nostroBalanceList
