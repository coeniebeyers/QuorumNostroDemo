pragma solidity ^0.4.2;

contract TokenContract {   
  function transferFrom(address _from, address _to, uint256 _value) returns (bool success); 
}

contract USDZAR {
    
  uint256 public rate;

  struct Approval{
    address approver;
    address tokenContract;
    uint256 value;
    uint256 rate;
  }

  mapping(address => Approval) approvals;

  event Approval(
      address indexed approver
    , address indexed tokenContract
    , uint256 indexed value
    , uint256 rate
  );

  function USDZAR(uint256 rate_) {
    rate = rate_;
  }

  // TODO: Should approvals only be valid for a specified time?
  function addApproval(address requester, address tokenContract, uint256 value, uint256 rate) 
    returns (bool success){

    Approval memory newApproval = Approval({
      approver: msg.sender,
      tokenContract: tokenContract,
      value: value,
      rate: rate
    });
    approvals[requester] = newApproval;
    Approval(msg.sender, tokenContract, value, rate);
    return true;
  }

  function receiveApproval(address requester, uint256 value, address tokenContract, bytes extraData)
    returns (bool success) {
    //TODO: first check both balances 
    var approval = approvals[requester];
    //TODO: check that approval hasn't expired yet
    //TODO: check rate against value approved for
    TokenContract token1 = TokenContract(approval.tokenContract);
    TokenContract token2 = TokenContract(tokenContract);
    //TODO: add checks for success
    token1.transferFrom(requester, approval.approver, value);
    token2.transferFrom(approval.approver, requester, approval.value);

    return true;
  }

  function setRate(uint256 _value) {
    rate = _value;
  }

  function getRate() returns (uint256){
    return rate;
  }

  function () {
    throw;
  }
}
