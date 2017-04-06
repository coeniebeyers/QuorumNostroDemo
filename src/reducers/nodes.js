const node = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_NODES':
      return {
        id: action.id,
        constellationAddress: action.constellationAddress,
        name: action.name
      }
    default:
      return state
  }
}

const nodeList = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_NODES':
      let found = false
      for(let i = 0; i < state.length; i++){
        let constellationAddress = state[i].constellationAddress
        if(constellationAddress === action.constellationAddress){
          found = true
          break
        }
      }
      if(!found){
        return [
          ...state,
          node(undefined, action)
        ]
      } else {
        return state
      }
    case 'REQUEST_NODES':
    default:
      return state
  }
}

export default nodeList
