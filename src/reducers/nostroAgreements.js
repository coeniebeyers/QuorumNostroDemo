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
      return [
        ...state,
        nostroAgreement(undefined, action)
      ]
    case 'REQUEST_NEW_NOSTROAGREEMENT':
    default:
      return state
  }
}

export default nostroAgreementList
