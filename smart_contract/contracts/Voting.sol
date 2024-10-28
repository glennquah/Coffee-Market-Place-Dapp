pragma solidity ^0.8.0;

import "./CoffeeMarketplace.sol";

contract Voting {
    uint256 public candidateCounter = 0;
    struct CoffeeVoteCandidate {
        uint256 candidateId;
        string coffeeName;
        string imageUrl;
        string description;
        string coffeeOrigin;
        string beanType;
        string roastLevel;
        string processingMethod;
        uint256 price;
        uint256 voteCount;
    }
    CoffeeMarketplace public coffeeMarketplace;
    CoffeeVoteCandidate[] public coffee_vote_candidates;
    address owner;
    mapping(address => bool) public customers;
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    bool public votingFinalized = false;

    event CoffeeCandidateAdded(string coffeeName, string imageUrl, string description, string coffeeOrigin, string beanType, string roastLevel, uint256 price);
    event CoffeeVoted(uint256 candidateId);
    event VotingFinalized(string coffeeName, string imageUrl, string description, string coffeeOrigin, string beanType, string roastLevel, uint256 price);

constructor(
            address _marketplaceContractAddress,
            string[] memory _coffeeCandidateNames,
            string[] memory _coffeeImageUrls,
            string[] memory _coffeeDescriptions,
            string[] memory _coffeeOrigins,
            string[] memory _beanTypes,
            string[] memory _roastLevels,
            string[] memory _processingMethods,
            uint256[] memory _prices,
            uint256 _durationInMinutes) {
    coffeeMarketplace = CoffeeMarketplace(_marketplaceContractAddress);
    for (uint256 i = 0; i < _coffeeCandidateNames.length; i++) {
        coffee_vote_candidates.push(CoffeeVoteCandidate({
                        candidateId: candidateCounter++,
                        coffeeName: _coffeeCandidateNames[i],
                        imageUrl: _coffeeImageUrls[i],
                        description: _coffeeDescriptions[i],
                        coffeeOrigin: _coffeeOrigins[i],
                        beanType: _beanTypes[i],
                        roastLevel: _roastLevels[i],
                        processingMethod: _processingMethods[i],
                        price: _prices[i],
                        voteCount: 0
        }));
    }
    owner = msg.sender;
    votingStartTime = block.timestamp;
    votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);
}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // This function is used to add a new coffee candidate to the voting list
    function addCoffeeCandidate(string memory _coffeeName,
                                string memory _imageUrl,
                                string memory _description,
                                string memory _coffeeOrigin,
                                string memory _beanType,
                                string memory _roastLevel,
                                string memory _processingMethod,
                                uint256 _price) public onlyOwner {
        coffee_vote_candidates.push(CoffeeVoteCandidate({
                candidateId: candidateCounter++,
                coffeeName: _coffeeName,
                imageUrl: _imageUrl,
                description: _description,
                coffeeOrigin: _coffeeOrigin,
                beanType: _beanType,
                roastLevel: _roastLevel,
                processingMethod: _processingMethod,
                price: _price,
                voteCount: 0
        }));
        emit CoffeeCandidateAdded(_coffeeName, _imageUrl, _description, _coffeeOrigin, _beanType, _roastLevel, _price);
    }

    // This function is used to vote for a coffee candidate
    function vote(uint256 _coffeeCandidateIndex) public {
        require(!customers[msg.sender], "You have already voted for a coffee.");
        require(_coffeeCandidateIndex < coffee_vote_candidates.length, "Invalid coffee candidate, please select a valid coffee candidate.");
        require(isOpenToVote(), "Voting is closed.");
        coffee_vote_candidates[_coffeeCandidateIndex].voteCount++;
        customers[msg.sender] = true;
        emit CoffeeVoted(_coffeeCandidateIndex);
    }

    // This function is used to get all the coffee candidates (used to get all their votes)
    function getAllVotesOfCoffeeCandiates() public view returns (CoffeeVoteCandidate[] memory){
        return coffee_vote_candidates;
    }

    // This function is to get the specific coffee candidate details
    function getCoffeeCandidate(uint256 _index) public view returns (CoffeeVoteCandidate memory) {
        require(_index < coffee_vote_candidates.length, "Invalid coffee candidate, please select a valid coffee candidate.");
        return coffee_vote_candidates[_index];
    }

    // This function is used to see if voting is still open
    function isOpenToVote() public view returns (bool) {
        return (block.timestamp >= votingStartTime && block.timestamp < votingEndTime);
    }

    // This function is used to get the remaining time for voting
    function getRemainingTimeLeftToVote() public view returns (uint256) {
        require(block.timestamp >= votingStartTime, "Voting has not started yet.");
        if (block.timestamp >= votingEndTime) {
            return 0;
    }
        return votingEndTime - block.timestamp;
    }

    // Pseudo-random number generator
    function random(uint256 _length) private view returns (uint256) {
        require(_length > 0, "Array length must be greater than 0.");
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % _length;
    }

    // To get the winner (with tie-breaker logic)
    function getWinner() public view returns (CoffeeVoteCandidate memory) {
        require(!isOpenToVote(), "Voting is still open.");

        uint256 maxVotes = 0;
        uint256 count = 0;
        CoffeeVoteCandidate[] memory potentialWinners = new CoffeeVoteCandidate[](coffee_vote_candidates.length);

        for (uint256 i = 0; i < coffee_vote_candidates.length; i++) {
            uint256 votes = coffee_vote_candidates[i].voteCount;

            if (votes > maxVotes) {
                maxVotes = votes;
                count = 1; // Reset count to 1 if its a new potential winner
                potentialWinners[0] = coffee_vote_candidates[i]; // Store the new potential winner to the first index in the array
            } else if (votes == maxVotes) {
                // Same vote count, add to potential winners
                potentialWinners[count] = coffee_vote_candidates[i];
                count++;
            }
        }

        // Randomly select one winner from the potential winners
        uint256 winnerIndex = random(count);
        return potentialWinners[winnerIndex];
    }

    function finalizeVotingAndMintNFTs() public onlyOwner() {
        CoffeeVoteCandidate memory winner = getWinner();

        // Mint 100 NFTs using the CoffeeMarketplace's addRoasterListing function
        coffeeMarketplace.addRoasterListing(
            winner.coffeeName,
            winner.description,
            winner.imageUrl,
            winner.price,
            100,
            winner.coffeeOrigin,
            winner.roastLevel,
            winner.beanType,
            winner.processingMethod
        );
        emit VotingFinalized(winner.coffeeName, winner.imageUrl, winner.description, winner.coffeeOrigin, winner.beanType, winner.roastLevel, winner.price);
    }
}