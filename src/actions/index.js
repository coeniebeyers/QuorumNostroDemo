require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch'

let nextTodoId = 0
export const addTodo = (text) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})

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
    node
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

