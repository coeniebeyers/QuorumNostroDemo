const nostroAgreement = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_NOSTROAGREEMENT':
      return {
        id: action.id,
        nostroAgreement: action.nostroAgreement
      }
    default:
      return state
  }
}

const nostroAgreementList = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_NOSTROAGREEMENT':
      let found = false; 
      for(let i = 0; i < state.length; i++){
        let currState = state[i]
        if(currState.nostroAgreement.id === action.nostroAgreement.id){
          found = true
          break
        }
      }
      if(found){
        return state
      } else {
        return [
          ...state,
          nostroAgreement(undefined, action)
        ]
      }
    case 'REQUEST_NEW_NOSTROAGREEMENT':
    default:
      return state
  }
}

export default nostroAgreementList
