pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import './CoffeeNFT.sol';

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
contract SealedAuction is
    ERC721URIStorage,
    Ownable,
    IERC721Receiver
{
    CoffeeNFT public nftContract;
    uint256 public auctionCounter = 0;
    uint256 public minimumAuctionFee;
    uint256 private withdrawableFund = 0;

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
    mapping(address => bool) public auctioneers;
    
    constructor(address _NFTAddress, uint256 __minimumAuctionFee) ERC721('CoffeeNFT', 'COFFEE') Ownable(msg.sender) {
        // Initialize the contract with the address of the NFT contract
        nftContract = CoffeeNFT(_NFTAddress);
        minimumAuctionFee = __minimumAuctionFee;
    }

    // Implement the onERC721Received function to accept NFTs
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    modifier onlySellerOrOwner(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].seller || msg.sender == owner(), "Only seller and owner can call this");
        _;
    }

    modifier onlySeller(uint256 auctionId) {
        require(msg.sender == auctions[auctionId].seller, "Only seller can call this");
        _;
    }

    modifier onlyAuctioneer() {
        require(auctioneers[msg.sender] == true, "Only auctioneer can call this");
        _;
    }

    modifier withinCommitPhase(uint256 auctionId) {
        require(block.timestamp < auctions[auctionId].auctionCommitEndTime , "Commit phase has ended");
        _;
    }

    modifier withinRevealPhase(uint256 auctionId) {
        require((block.timestamp >= auctions[auctionId].auctionCommitEndTime && block.timestamp < auctions[auctionId].auctionRevealEndTime), "Not within reveal phase");
        _;
    }

    modifier afterRevealPhase(uint256 auctionId) {
        require(block.timestamp >= auctions[auctionId].auctionRevealEndTime , "Reveal phase still ongoing");
        _;
    }

    modifier _minimumAuctionFee() {
        require(msg.value >=  minimumAuctionFee, "Minimum auction fee is needed");
        _;
    }
    modifier auctionExists(uint256 auctionId) {
        require(auctions[auctionId].auctionId != 0, "Auction does not exist");
        _;
    }
    //Events
    event AuctioneerAdded(address auctioneer);
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

    // Add an auctioneer
    function addAuctioneer(address _auctioneer) public onlyOwner {
        auctioneers[_auctioneer] = true;
        emit AuctioneerAdded(_auctioneer);
    }

    // Create a new auction
    function createAuction(
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint256 productId,
        uint256 price,
        string memory origin,
        string memory roastLevel,
        string memory beanType,
        string memory processMethod,

        uint256 _auctionCommitEndTimeInHour, 
        uint256 _auctionRevealEndTimeInHour
    ) public payable _minimumAuctionFee onlyAuctioneer {
        require(_auctionRevealEndTimeInHour > _auctionCommitEndTimeInHour, "End time should be greater than start time");
        uint256 tokenId = nftContract.mint(
            address(this), 
            name, 
            description, 
            ipfsHash, 
            productId, 
            price, 
            origin, 
            roastLevel, 
            beanType, 
            processMethod
        );
        
        withdrawableFund += minimumAuctionFee; 
        auctionCounter++;
        auctions[auctionCounter] = AuctionData(auctionCounter, payable(msg.sender), 0, address(0), block.timestamp, block.timestamp + _auctionCommitEndTimeInHour * 1 hours, block.timestamp + _auctionRevealEndTimeInHour * 1 hours, false, false,false, tokenId);
        emit AuctionCreated(auctionCounter, msg.sender, tokenId);
    }

    // Commit phase: users submit their hashed bid
    function commitBid(uint256 auctionId, bytes32 _commitHash) public auctionExists(auctionId) withinCommitPhase(auctionId) {
        require(auctionsBid[auctionId][msg.sender].commitHash == 0, "Already committed");
        require(auctions[auctionId].auctionId != 0, "Auction does not exist");
        
        // Record the commit hash and bid value (value is held in the contract)
        auctionsBid[auctionId][msg.sender] = Bid(_commitHash, 0, false);
        emit BidCommitted(auctionId, msg.sender, _commitHash);
    }

    // Reveal phase: users reveal their bid by submitting the original bid and nonce
    function revealBid(uint256 auctionId, uint256 _bidAmount, uint256 _nonce) public payable auctionExists(auctionId) withinRevealPhase(auctionId) {
        require(auctions[auctionId].auctionId != 0, "Auction does not exist");
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
    function finalizeAuction(uint256 auctionId) public onlySellerOrOwner(auctionId) auctionExists(auctionId) afterRevealPhase(auctionId) {
        require(auctions[auctionId].finalized == false, "Auction already finalized");
        auctions[auctionId].finalized = true;
        
        //settle the auction
        if (auctions[auctionId].highestBidder != address(0)) { // If there are bids
            // Transfer the NFT to the winner
            // Comment the below line to test the contract
            nftContract.transferFrom(address(this), auctions[auctionId].highestBidder, auctions[auctionId].tokenId);
            emit NFTTransferred(auctionId, auctions[auctionId].highestBidder);
            // Transfer the highest bid amount to the owner (auctioneer)
            payable(auctions[auctionId].seller).transfer(auctions[auctionId].highestBid * 1 ether);
            emit HighestBidTransferred(auctionId, auctions[auctionId].seller, auctions[auctionId].highestBid);
        } else { // If no bids were placed
            auctions[auctionId].withdrawnBySeller = true;
            // Transfer the NFT back to the seller
            // Comment the below line to test the contract
            // if(!test) {
                nftContract.transferFrom(address(this), auctions[auctionId].seller, auctions[auctionId].tokenId);
                // IERC721(NFTAddress).transferFrom(address(this), auctions[auctionId].seller, auctions[auctionId].tokenId);
            // }
            emit NoBidder(auctionId);
        }
        emit AuctionFinalized(auctionId, auctions[auctionId].highestBidder, auctions[auctionId].highestBid);
    }

    // Withdraw refunds for non-winning bids
    function withdrawRefund(uint256 auctionId) public auctionExists(auctionId) afterRevealPhase(auctionId) {
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
    function getAuction(uint256 auctionId) public view auctionExists(auctionId) returns (AuctionData memory)  {
        return auctions[auctionId];
    }
    
    //Owner functions
    function getWithdrawableFund() public view onlyOwner returns (uint256) {
        return withdrawableFund;
    }
    // Owner can withdraw the balance of the contract
    function ownerWithdraw() public onlyOwner {
        require(withdrawableFund > 0, "No funds to withdraw");
        address owner = owner();
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