const selectedNostroAgreement = (state = "", action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_NOSTRO':
			{
				console.log('action:', action);
				return action.selectedNostroAgreement;
			}
    default:
      return state
  }
}

export default selectedNostroAgreement
