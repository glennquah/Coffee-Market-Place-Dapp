pragma solidity ^0.8.0;

contract Hash {

    function hash(uint256 _bidAmount, uint256 _nonce) public pure returns (bytes32)  {
        return keccak256(abi.encodePacked(_bidAmount, _nonce));
    }
}