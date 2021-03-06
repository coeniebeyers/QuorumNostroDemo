require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'

let ipAddressAndPort = process.env.REACT_APP_API_URL

let nextAccountId = 0;
export const REQUEST_NEW_ACCOUNT = 'REQUEST_NEW_ACCOUNT'
function requestNewAccount() {
  return {
    type: REQUEST_NEW_ACCOUNT
  }
}

export const RECEIVE_NEW_ACCOUNT = 'RECEIVE_NEW_ACCOUNT'
function receiveNewAccount(accountName, accountAddress) {
  return {
    type: RECEIVE_NEW_ACCOUNT,
    id: nextAccountId++,
    accountName,
    accountAddress
  }
}

export function addAccount(accountName){
  return function(dispatch) {

    dispatch(requestNewAccount());
  
    fetch(ipAddressAndPort+"/getNewAccountAddress")
    .then(response => response.json())
    .then(json => {
      dispatch(receiveNewAccount(accountName, json.address));
    })
  }
}

export function getExistingAccounts(){
  return function(dispatch) {

    fetch(ipAddressAndPort+"/getAccountMapping")
    .then(response => response.json())
    .then(accountMapping => {
      let keys = Object.keys(accountMapping);
      console.log('keys:', keys)
      for(let i=0; i<keys.length; i++){
        let key = keys[i];
        dispatch(receiveNewAccount(accountMapping[key], key));
      }
    })
  }
}


let nextNodeId = 0;
export const REQUEST_NODES = 'REQUEST_NODES'
function requestNodes() {
  return {
    type: REQUEST_NODES
  }
}

export const RECEIVE_NODES = 'RECEIVE_NODES'
function receiveNodes(node) {
  return {
    type: RECEIVE_NODES,
    id: nextNodeId++,
    name: node.name,
    constellationAddress: node.constellationAddress
  }
}

export function pollNewNodes(){
  return function(dispatch) {

    dispatch(requestNodes());
  
    fetch(ipAddressAndPort+"/getNodes")
    .then(response => response.json())
    .then(nodeList => {
      for(var i = 0; i < nodeList.length; i++){
        var node = nodeList[i];
        dispatch(receiveNodes(node));
      }
    })
  }
}

let nextNostroAgreementId = 0;
export const REQUEST_NEW_NOSTROAGREEMENT = 'REQUEST_NEW_NOSTROAGREEMENT'
function requestNewNostroAgreement() {
  return {
    type: REQUEST_NEW_NOSTROAGREEMENT
  }
}

export const RECEIVE_NEW_NOSTROAGREEMENT = 'RECEIVE_NEW_NOSTROAGREEMENT'
function receiveNewNostroAgreement(nostroAgreement) {
  return {
    type: RECEIVE_NEW_NOSTROAGREEMENT,
    id: nextNostroAgreementId++,
    nostroAgreement
  }
}

export function addNostroAgreement(nostroAgreementDetails){
  return function(dispatch) {
    // TODO: Add this node name
    fetch(ipAddressAndPort+"/deployNewNostroAgreement?details="+JSON.stringify(nostroAgreementDetails))
  }
}

export function pollNostroAgreements(){
  return function(dispatch) {

    dispatch(requestNewNostroAgreement())

    fetch(ipAddressAndPort+"/getNostroAgreements")
    .then(response => response.json())
    .then(nostroAgreements => {
      for(var i = 0; i < nostroAgreements.length; i++){
        var nostroAgreement = nostroAgreements[i]
        dispatch(receiveNewNostroAgreement(nostroAgreement));
      }
    })
  }
}

let nextNostroBalanceId = 0;
export const REQUEST_NEW_NOSTROBALANCE = 'REQUEST_NEW_NOSTROBALANCE'
function requestNewNostroBalance() {
  return {
    type: REQUEST_NEW_NOSTROBALANCE
  }
}

export const RECEIVE_NEW_NOSTROBALANCE = 'RECEIVE_NEW_NOSTROBALANCE'
function receiveNewNostroBalance(nostroBalance) {
  return {
    type: RECEIVE_NEW_NOSTROBALANCE,
    id: nextNostroBalanceId++,
    nostroBalance
  }
}

export function pollNostroBalances(){
  return function(dispatch) {

    dispatch(requestNewNostroBalance())

    fetch(ipAddressAndPort+"/getNostroBalances")
    .then(response => response.json())
    .then(nostroBalances => {
      //console.log('nostroBalances:', nostroBalances);
      for(var i = 0; i < nostroBalances.length; i++){
        var nostroBalance = nostroBalances[i]
        dispatch(receiveNewNostroBalance(nostroBalance));
      }
    })
  }
}

export function topUpNostro(requestedAmount, selectedNostroAgreement){
  return function(dispatch) {
		var topUpDetails = {
			currency2Amount: requestedAmount,
			nostroAgreementId: selectedNostroAgreement
		};

    fetch(ipAddressAndPort+"/requestNostroTopUp?details="+JSON.stringify(topUpDetails))
    .then(response => response.json())
    .then(response => {
      console.log('response:', response);
    })
  }
}


export const UPDATE_SELECTED_NOSTRO = 'UPDATE_SELECTED_NOSTRO'
export function updateSelectedNostroAgreement(selectedNostroAgreement) {
  return {
    type: UPDATE_SELECTED_NOSTRO,
    selectedNostroAgreement
  }
}
