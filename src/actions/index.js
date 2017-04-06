require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'

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
  
    fetch("http://localhost:4000/getNewAccountAddress")
    .then(response => response.json())
    .then(json => {
      dispatch(receiveNewAccount(accountName, json.address));
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
  
    fetch("http://localhost:4000/getNodes")
    .then(response => response.json())
    .then(nodeList => {
      for(var i = 0; i < nodeList.length; i++){
        var node = nodeList[i];
        dispatch(receiveNodes(node));
      }
    })
  }
}

let nextContractId = 0;
export const REQUEST_NEW_CONTRACT = 'REQUEST_NEW_CONTRACT'
function requestNewContract(contractName) {
  return {
    type: REQUEST_NEW_CONTRACT
  }
}

export const RECEIVE_NEW_CONTRACT = 'RECEIVE_NEW_CONTRACT'
function receiveNewContract(contractName, contractAddress) {
  console.log('contractName:', contractName);
  console.log('contractAddress:', contractAddress);
  return {
    type: RECEIVE_NEW_CONTRACT,
    id: nextContractId++,
    contractName,
    contractAddress
  }
}

export function addContract(contractName){
  return function(dispatch) {

    dispatch(requestNewContract(contractName));
  
    fetch("http://localhost:4000/getNewContractAddress")
    .then(response => response.json())
    .then(json => {
      var address = json.address
      dispatch(receiveNewContract(contractName, address));
    })
  }
}
