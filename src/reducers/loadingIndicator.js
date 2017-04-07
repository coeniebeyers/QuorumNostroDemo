const loadingIndicator = (state = "false", action) => {
  switch (action.type) {
    case 'RECEIVE_NEW_ACCOUNT':
      return "false"
    case 'REQUEST_NEW_ACCOUNT':
			return "true"
    default:
      return state
  }
}

export default loadingIndicator
