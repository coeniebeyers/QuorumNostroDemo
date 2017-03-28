pragma solidity ^0.4.2;

contract USDZAR {
    
  uint256 public rate;

  function USDZAR(uint256 rate_) {
    rate = rate_;
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
