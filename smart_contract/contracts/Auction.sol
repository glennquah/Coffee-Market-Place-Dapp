pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/*
* Open Auction
* 
* An open auction contract that autioner to create auctions.
* The contract allows the owner to set a minimum auction fee 
* The contract allows the autioner to set the minimum bid and minimum bid increment.
* The contract also allows the owner to withdraw the balance of the contract.
* The contract allows the bidder to bid on the auction.
* The contract will transfer the NFT to the highest bidder after the auction ends.
* The contract will transfer the highest bid amount to the autioner after the auction ends.
* The contract will return bid to the bidder if the bid is not the highest.
* The contract will return the NFT to the seller if no bids were placed.
* 
*/

contract Auction {
    address public NFTAddress;
    uint256 public auctionCounter = 0;
    address owner;
    uint256 public minimumAuctionFee; // For auction creation

    struct AuctionData {
        uint256 auctionId;
        address payable seller;
        uint256 highestBid;
        address highestBidder;
        uint256 auctionStartTime;
        uint256 auctionEndTime;
        uint256 miniumBidAmount;
        uint256 miniumBidIncrement;
        uint256 tokenId;
    }
    mapping(uint256 => AuctionData) public auctions;
    mapping(uint256 => mapping(address => uint256)) public auctionsBid;
    constructor(address _NFTAddress, uint256 __minimumAuctionFee) {
        // Initialize the contract with the address of the NFT contract
        NFTAddress = _NFTAddress;
        minimumAuctionFee = __minimumAuctionFee;
        owner = msg.sender;
    }
    event AuctionAdded(
        address  seller,
        uint256 highestBid,
        address highestBidder,
        uint256 auctionStartTime,
        uint256 auctionEndTime,
        uint256 miniumBidAmount,
        uint256 miniumBidIncrement,
        uint256 tokenId
    );
    event AuctionBid(uint256 auctionId, address bidder, uint256 bidAmount);
    event AuctionFinalized(uint256 auctionId, address winner, uint256 winningBid);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlySellerOrOwner(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].seller || msg.sender == owner, "Only seller and owner can call this");
        _;
    }

    modifier _minimumAuctionFee() {
        require(msg.value >=  minimumAuctionFee * 1e18, "Minimum auction fee is needed");
        _;
    }

    modifier allowBid(uint256 auctionId) {
        require(block.timestamp >= auctions[auctionId].auctionStartTime && block.timestamp <= auctions[auctionId].auctionEndTime, "Auction is not active");
        _;
    }

    modifier finalized(uint256 auctionId) {
        require(block.timestamp >= auctions[auctionId].auctionEndTime, "Auction already finalized");
        _;
    }

    modifier higherBid(uint256 auctionId) {
        require(msg.value > (auctions[auctionId].highestBid + auctions[auctionId].miniumBidIncrement), "Bid must be higher than the current bid and must be an increment of the minium bid increment");
        _;
    }

    // Create a new auction
    function createAuction(uint256 _tokenId, uint256 _miniumBidAmount, uint256 _auctionStartTime, uint256 _auctionEndTime, uint256 _miniumBidIncrement) public payable _minimumAuctionFee {
        IERC721(NFTAddress).transferFrom(msg.sender, address(this), _tokenId);
        auctionCounter++;
        auctions[auctionCounter] = AuctionData(auctionCounter, payable(msg.sender), 0, address(0), _auctionStartTime, _auctionEndTime, _miniumBidAmount, _miniumBidIncrement, _tokenId);

        emit AuctionAdded(
            msg.sender,
            0,
            address(0),
            _auctionStartTime,
            _auctionEndTime,
            _miniumBidAmount,
            _miniumBidIncrement,
            _tokenId
        );
    }

    // Bid on an auction
    function bid(uint256 auctionId) public payable higherBid(auctionId) allowBid(auctionId) {
        require(msg.value > 0, "Must send ETH with your bid");
        
        // Record the commit hash and bid value (value is held in the contract)
        auctionsBid[auctionId][msg.sender] = msg.value;

        // prevent re-entrancy
        address oldHighestBidder = payable(auctions[auctionId].highestBidder);
        uint256 oldHighestBid = auctions[auctionId].highestBid;
        
        // Update the highest bid if the new bid is higher
        if (msg.value > oldHighestBid) {
            auctions[auctionId].highestBid = msg.value;
            auctions[auctionId].highestBidder = msg.sender;
        }
        payable(oldHighestBidder).transfer(oldHighestBid);

        emit AuctionBid(auctionId, msg.sender, msg.value);
        
    }

    // End auction and transfer nft to the winner
    // Owner can also finalize the auction if no bids were placed or if the seller is inactive
    function finalizeAuction(uint256 auctionId) public onlySellerOrOwner(auctionId) finalized(auctionId){
        if (auctions[auctionId].highestBidder != address(0)) { // If there are bids
            // Transfer the highest bid amount to the owner (auctioneer)
            // prevent re-entrancy
            address highestBidder = auctions[auctionId].highestBidder;
            uint256 highestBid = auctions[auctionId].highestBid;
            auctions[auctionId].highestBid = 0;
            auctions[auctionId].highestBidder = address(0);
            payable(highestBidder).transfer(highestBid);

            // Transfer the NFT to the highest bidder
            IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].highestBidder, auctions[auctionId].tokenId);

            emit AuctionFinalized(auctionId, highestBidder, highestBid);
        } else { // If no bids were placed
            // Transfer the NFT back to the seller
            IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].seller, auctions[auctionId].tokenId);
            emit AuctionFinalized(auctionId, auctions[auctionId].seller, 0);
        }
    }

    //Getters fuction
    function getAuction(uint256 auctionId) public view returns (AuctionData memory) {
        return auctions[auctionId];
    }

    function getHighestBid(uint256 auctionId) public view returns (uint256) {
        return auctions[auctionId].highestBid;
    }
    function getAuctionEndTime(uint256 auctionId) public view returns (uint256) {
        return auctions[auctionId].auctionEndTime;
    }
    function getAuctionStartTime(uint256 auctionId) public view returns (uint256) {
        return auctions[auctionId].auctionStartTime;
    }
    function getMinimumBidAmount(uint256 auctionId) public view returns (uint256) {
        return auctions[auctionId].miniumBidAmount;
    }
    function getMinimumBidIncrement(uint256 auctionId) public view returns (uint256) {
        return auctions[auctionId].miniumBidIncrement;
    }
    function getTokenId(uint256 auctionId) public view returns (uint256) {
        return auctions[auctionId].tokenId;
    }

    //Owner functions

    // Owner can withdraw the balance of the contract
    function ownerWithdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Owner can change the minimum auction fee
    function setMinimumAuctionFee(uint256 __minimumAuctionFee) public onlyOwner {
        minimumAuctionFee = __minimumAuctionFee;
    }
}