pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/*
 * Sealed-bid Auction
 * 
 * A sealed-bid auction contract that allows users to create and bid on auctions.
 * The contract allows the owner to set a minimum auction fee
 * The contract allows the autioner to set the minimum bid.
 * The contract also allows the owner to withdraw the balance of the contract.
 * The contract allows the bidder to commit a hashed bid and reveal the bid later.
 * The contract allows the bidder to withdraw the refund if the bid is not the highest.
 * 
 * 
 */
contract SealedAuction {
    address public NFTAddress;
    uint256 public auctionCounter = 0;
    address public  owner;
    uint256 public minimumAuctionFee;
    uint256 private withdrawableFund = 0;
    bool private test = false;

    struct AuctionData {
        uint256 auctionId;
        address payable seller;
        uint256 highestBid;
        address highestBidder;
        uint256 auctionStartTime;
        uint256 auctionCommitEndTime;
        uint256 auctionRevealEndTime;
        bool finalized;
        bool withdrawnByWinner;
        bool withdrawnBySeller;
        uint256 tokenId;
    }
    struct Bid {
        bytes32 commitHash;
        uint256 bidAmount;
        bool revealed;
    }
    mapping(uint256 => AuctionData) public auctions;
    mapping(uint256 => mapping(address => Bid)) public auctionsBid;
    
    constructor(address _NFTAddress, uint256 __minimumAuctionFee, bool _test) {
        // Initialize the contract with the address of the NFT contract
        NFTAddress = _NFTAddress;
        minimumAuctionFee = __minimumAuctionFee;
        owner = msg.sender;
        test = _test;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlySellerOrOwner(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].seller || msg.sender == owner, "Only seller and owner can call this");
        _;
    }

    modifier onlySeller(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].seller, "Only seller can call this");
        _;
    }

    modifier withinCommitPhase(uint256 auctionId) {
        require(block.timestamp < auctions[auctionId].auctionCommitEndTime || test, "Commit phase has ended");
        _;
    }

    modifier withinRevealPhase(uint256 auctionId) {
        require((block.timestamp >= auctions[auctionId].auctionCommitEndTime && block.timestamp < auctions[auctionId].auctionRevealEndTime) || test, "Not within reveal phase");
        _;
    }

    modifier afterRevealPhase(uint256 auctionId) {
        require(block.timestamp >= auctions[auctionId].auctionRevealEndTime || test, "Reveal phase still ongoing");
        _;
    }

    modifier _minimumAuctionFee() {
        require(msg.value >=  minimumAuctionFee, "Minimum auction fee is needed");
        _;
    }

    //Events
    event AuctionCreated(uint256 auctionId, address seller, uint256 tokenId);
    event BidCommitted(uint256 auctionId, address bidder, bytes32 commitHash);
    event BidRevealed(uint256 auctionId, address bidder, uint256 bidAmount);
    event AuctionFinalized(uint256 auctionId, address winner, uint256 bidAmount);
    event NFTTransferred(uint256 auctionId, address winner);
    event HighestBidTransferred(uint256 auctionId, address seller, uint256 highestBid);
    event NoBidder(uint256 auctionId);
    event HighestBidderChanged(uint256 auctionId, address highestBidder);
    event RefundWithdrawn(uint256 auctionId, address bidder, uint256 refundAmount);
    event OwnerWithdraw(uint256 amount);
    event MinimumAuctionFeeSet(uint256 amount);

    // Create a new auction
    function createAuction(uint256 _NFTId, uint256 _auctionCommitEndTimeInHour, uint256 _auctionRevealEndTimeInHour) public payable _minimumAuctionFee {
        require(_auctionRevealEndTimeInHour > _auctionCommitEndTimeInHour, "Timing is wrong");
        withdrawableFund += minimumAuctionFee; 
        if(!test) {
            IERC721(NFTAddress).transferFrom(msg.sender, address(this), _NFTId);
        }
        auctionCounter++;
        auctions[auctionCounter] = AuctionData(auctionCounter, payable(msg.sender), 0, address(0), block.timestamp, block.timestamp + _auctionCommitEndTimeInHour * 1 hours, block.timestamp + _auctionRevealEndTimeInHour * 1 hours, false, false,false, _NFTId);
        emit AuctionCreated(auctionCounter, msg.sender, _NFTId);
    }

    // Commit phase: users submit their hashed bid
    function commitBid(uint256 auctionId, bytes32 _commitHash) public  withinCommitPhase(auctionId) {
        require(auctionsBid[auctionId][msg.sender].commitHash == 0, "Already committed");
        
        // Record the commit hash and bid value (value is held in the contract)
        auctionsBid[auctionId][msg.sender] = Bid(_commitHash, 0, false);
        emit BidCommitted(auctionId, msg.sender, _commitHash);
    }

    // Reveal phase: users reveal their bid by submitting the original bid and nonce
    function revealBid(uint256 auctionId, uint256 _bidAmount, uint256 _nonce) public payable withinRevealPhase(auctionId) {

        Bid storage bid = auctionsBid[auctionId][msg.sender];
        require(bid.commitHash != 0, "No bid to reveal");
        
        require(!bid.revealed, "Already revealed");
        
        // Recreate the hash from the provided bid amount and nonce
        bytes32 calculatedHash = keccak256(abi.encodePacked(_bidAmount, _nonce));

        // Verify the hash matches the one submitted during the commit phase
        require(calculatedHash == bid.commitHash, "Hash mismatch. Incorrect bid or nonce");
        require(_bidAmount * 1 ether == msg.value, "Incorrect bid amount");
        auctionsBid[auctionId][msg.sender].revealed = true;
        auctionsBid[auctionId][msg.sender].bidAmount = _bidAmount;

        // Check if it's the highest bid
        if (_bidAmount > auctions[auctionId].highestBid) {
            auctions[auctionId].highestBid = _bidAmount;
            auctions[auctionId].highestBidder = msg.sender;
            emit HighestBidderChanged(auctionId, msg.sender);
        } else if (_bidAmount == auctions[auctionId].highestBid) {
            // In case of a tie,  random winner is selected 
            uint a = block.timestamp;
            uint msgSender = uint(keccak256(abi.encodePacked(msg.sender))) % (a / 1000);
            uint highestBidder = uint(keccak256(abi.encodePacked(auctions[auctionId].highestBidder))) % (a / 1000);
            if (msgSender > highestBidder) {
                auctions[auctionId].highestBidder = msg.sender;
                emit HighestBidderChanged(auctionId, msg.sender);
            }
        }
        emit BidRevealed(auctionId, msg.sender, _bidAmount);
    }

    // End auction and transfer funds to the winner
    // Owner can also finalize the auction if no bids were placed or if the seller is inactive
    function finalizeAuction(uint256 auctionId) public onlySellerOrOwner(auctionId) afterRevealPhase(auctionId) {
        require(auctions[auctionId].finalized == false, "Auction already finalized");
        auctions[auctionId].finalized = true;
        
        //settle the auction
        if (auctions[auctionId].highestBidder != address(0)) { // If there are bids
            // Transfer the NFT to the winner
            // Comment the below line to test the contract
            if(!test) {
                IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].highestBidder, auctions[auctionId].tokenId);
            }
            emit NFTTransferred(auctionId, auctions[auctionId].highestBidder);
            // Transfer the highest bid amount to the owner (auctioneer)
            payable(auctions[auctionId].seller).transfer(auctions[auctionId].highestBid * 1 ether);
            emit HighestBidTransferred(auctionId, auctions[auctionId].seller, auctions[auctionId].highestBid);
        } else { // If no bids were placed
            auctions[auctionId].withdrawnBySeller = true;
            // Transfer the NFT back to the seller
            // Comment the below line to test the contract
            if(!test) {
                IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].seller, auctions[auctionId].tokenId);
            }
            emit NoBidder(auctionId);
        }
        emit AuctionFinalized(auctionId, auctions[auctionId].highestBidder, auctions[auctionId].highestBid);
    }

    // Withdraw refunds for non-winning bids
    function withdrawRefund(uint256 auctionId) public afterRevealPhase(auctionId) {
        require(auctions[auctionId].finalized == true, "Auction have yet finalized");
        Bid storage bid = auctionsBid[auctionId][msg.sender];
        require(bid.revealed, "Bid not revealed");
        require(msg.sender != auctions[auctionId].highestBidder, "Winner cannot withdraw");
        // Refund the user's bid amount
        uint256 refundAmount = bid.bidAmount;
        auctionsBid[auctionId][msg.sender].bidAmount = 0; // Prevent re-entrancy
        payable(msg.sender).transfer(refundAmount * 1 ether);
        emit RefundWithdrawn(auctionId, msg.sender, refundAmount);
    }

    //Getters fuction
    function getAuction(uint256 auctionId) public view returns (AuctionData memory) {
        return auctions[auctionId];
    }
    
    //Owner functions
    function getWithdrawableFund() public view onlyOwner returns (uint256) {
        return withdrawableFund;
    }
    // Owner can withdraw the balance of the contract
    function ownerWithdraw() public onlyOwner {
        require(withdrawableFund > 0, "No funds to withdraw");
        payable(owner).transfer(withdrawableFund);
        withdrawableFund = 0;
        emit OwnerWithdraw(withdrawableFund);
    }

    // Owner can change the minimum auction fee
    function setMinimumAuctionFee(uint256 __minimumAuctionFee) public onlyOwner {
        minimumAuctionFee = __minimumAuctionFee;
        emit MinimumAuctionFeeSet(minimumAuctionFee);
    }
}