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

const nostroBalanceList = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_NOSTROBALANCE':
      console.log('state:', state);
      let found = false; 
      for(let i = 0; i < state.length; i++){
        let currState = state[i]
        // TODO: This only caters for new addresses!!!
        // A much more involved comparison is needed when balances update
        if(currState.nostroBalance.address === action.nostroBalance.address){
          found = true
          break
        }
      }
      if(found){
        return state
      } else {
        return [
          ...state,
          nostroBalance(undefined, action)
        ]
      }
    case 'REQUEST_NEW_NOSTROBALANCE':
    default:
      return state
  }
}

export default nostroBalanceList
