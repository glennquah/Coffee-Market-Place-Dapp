pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    address public NFTAddress;
    uint256 public auctionCounter = 0;
    address owner;
    uint256 public minimumAuctionFee;
    struct AuctionData {
        uint256 auctionId;
        address payable seller;
        uint256 highestBid;
        address highestBidder;
        uint256 auctionStartTime;
        uint256 auctionCommitEndTime;
        uint256 auctionRevealEndTime;
        uint256 miniumBidAmount;
        bool finalized;
        uint256 tokenId;
    }
    struct Bid {
        bytes32 commitHash;
        uint256 bidAmount;
        bool revealed;
    }
    mapping(uint256 => AuctionData) public auctions;
    mapping(uint256 => mapping(address => Bid)) public auctionsBid;
    constructor(address _NFTAddress, uint256 _minimumAuctionFee) {
        // Initialize the contract with the address of the NFT contract
        NFTAddress = _NFTAddress;
        minimumAuctionFee = _minimumAuctionFee;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlySellerOrOwner(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].seller || msg.sender == owner, "Only seller and owner can call this");
        _;
    }

    modifier withinCommitPhase(uint256 auctionId) {
        require(block.timestamp < auctions[auctionId].auctionCommitEndTime, "Commit phase has ended");
        _;
    }

    modifier withinRevealPhase(uint256 auctionId) {
        require(block.timestamp >= auctions[auctionId].auctionCommitEndTime && block.timestamp < auctions[auctionId].auctionRevealEndTime, "Not within reveal phase");
        _;
    }

    modifier afterRevealPhase(uint256 auctionId) {
        require(block.timestamp >= auctions[auctionId].auctionRevealEndTime, "Reveal phase still ongoing");
        _;
    }

    modifier _minimumAuctionFee() {
        require(msg.value >=  minimumAuctionFee * 1e18, "Minimum auction fee is needed");
        _;
    }

    // Create a new auction
    function createAuction(uint256 _tokenId, uint256 _miniumBidAmount, uint256 _auctionCommitEndTime, uint256 _auctionRevealEndTime) public payable _minimumAuctionFee {
        IERC721(NFTAddress).transferFrom(msg.sender, address(this), _tokenId);
        auctionCounter++;
        auctions[auctionCounter] = AuctionData(auctionCounter, payable(msg.sender), 0, address(0), block.timestamp, _auctionCommitEndTime, _auctionRevealEndTime, _miniumBidAmount, false, _tokenId);
    }

    // Commit phase: users submit their hashed bid
    function commitBid(uint256 auctionId, bytes32 _commitHash) public payable withinCommitPhase(auctionId) {
        require(auctionsBid[auctionId][msg.sender].commitHash == 0, "Already committed");
        require(msg.value > 0, "Must send ETH with your bid");
        require(msg.value > auctions[auctionId].miniumBidAmount, "Bid must be higher than the current bid");
        
        // Record the commit hash and bid value (value is held in the contract)
        auctionsBid[auctionId][msg.sender] = Bid(_commitHash, msg.value, false);
    }

    // Reveal phase: users reveal their bid by submitting the original bid and nonce
    function revealBid(uint256 auctionId, uint256 _bidAmount, uint256 _nonce) public withinRevealPhase(auctionId) {
        Bid storage bid = auctionsBid[auctionId][msg.sender];
        require(bid.commitHash != 0, "No bid to reveal");
        require(!bid.revealed, "Already revealed");
        
        // Recreate the hash from the provided bid amount and nonce
        bytes32 calculatedHash = keccak256(abi.encodePacked(_bidAmount, _nonce));

        // Verify the hash matches the one submitted during the commit phase
        require(calculatedHash == bid.commitHash, "Hash mismatch. Incorrect bid or nonce");

        bid.revealed = true;
        bid.bidAmount = _bidAmount;

        // Check if it's the highest bid
        if (_bidAmount > auctions[auctionId].highestBid) {
            auctions[auctionId].highestBid = _bidAmount;
            auctions[auctionId].highestBidder = msg.sender;
        }
    }

    // End auction and transfer funds to the winner
    // Owner can also finalize the auction if no bids were placed or if the seller is inactive
    function finalizeAuction(uint256 auctionId) public onlySellerOrOwner(auctionId) afterRevealPhase(auctionId) {
        require(auctions[auctionId].finalized == false, "Auction already finalized");
        if (auctions[auctionId].highestBidder != address(0)) { // If there are bids
            // Mark the auction as finalized
            auctions[auctionId].finalized = true;
            // Transfer the highest bid amount to the owner (auctioneer)
            payable(owner).transfer(auctions[auctionId].highestBid);

            // Transfer the NFT to the highest bidder
            IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].highestBidder, auctions[auctionId].tokenId);
        } else { // If no bids were placed
            auctions[auctionId].finalized = true;
            // Transfer the NFT back to the seller
            IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].seller, auctions[auctionId].tokenId);
        }
    }

    // Withdraw refunds for non-winning bids
    function withdrawRefund(uint256 auctionId) public afterRevealPhase(auctionId) {
        require(auctions[auctionId].finalized == true, "Auction have yet finalized");
        Bid storage bid = auctionsBid[auctionId][msg.sender];
        require(bid.revealed, "Bid not revealed");
        require(msg.sender != auctions[auctionId].highestBidder, "Winner cannot withdraw");

        // Refund the user's bid amount
        uint256 refundAmount = bid.bidAmount;
        bid.bidAmount = 0; // Prevent re-entrancy
        payable(msg.sender).transfer(refundAmount);
    }

    //Getters fuction
    function getAuction(uint256 auctionId) public view returns (AuctionData memory) {
        return auctions[auctionId];
    }

    //Owner functions

    // Owner can withdraw the balance of the contract
    function ownerWithdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Owner can change the minimum auction fee
    function setMinimumAuctionFee(uint256 _minimumAuctionFee) public onlyOwner {
        minimumAuctionFee = _minimumAuctionFee;
    }
}