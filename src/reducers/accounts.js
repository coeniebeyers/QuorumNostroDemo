const account = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_ACCOUNT':
      return {
        id: action.id,
        accountName: action.accountName,
        accountAddress: action.accountAddress,
      }
    default:
      return state
  }
}

const accountList = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_ACCOUNT':
      return [
        ...state,
        account(undefined, action)
      ]
    case 'REQUEST_NEW_ACCOUNT':
    default:
      return state
  }
}

export default accountList
