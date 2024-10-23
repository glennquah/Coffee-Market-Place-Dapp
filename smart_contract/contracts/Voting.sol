pragma solidity ^0.8.0;

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
        uint256 voteCount;
    }

    CoffeeVoteCandidate[] public coffee_vote_candidates;
    address owner;
    mapping(address => bool) public customers;
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    event CoffeeCandidateAdded(string coffeeName, string imageUrl, string description, string coffeeOrigin, string beanType, string roastLevel);
    event CoffeeVoted(uint256 candidateId);

constructor(string[] memory _coffeeCandidateNames,
            string[] memory _coffeeImageUrls,
            string[] memory _coffeeDescriptions,
            string[] memory _coffeeOrigins,
            string[] memory _beanTypes,
            string[] memory _roastLevels,
            uint256 _durationInMinutes) {
    for (uint256 i = 0; i < _coffeeCandidateNames.length; i++) {
        coffee_vote_candidates.push(CoffeeVoteCandidate({
                        candidateId: candidateCounter++,
                        coffeeName: _coffeeCandidateNames[i],
                        imageUrl: _coffeeImageUrls[i],
                        description: _coffeeDescriptions[i],
                        coffeeOrigin: _coffeeOrigins[i],
                        beanType: _beanTypes[i],
                        roastLevel: _roastLevels[i],
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
                                string memory _roastLevel) public onlyOwner {
        coffee_vote_candidates.push(CoffeeVoteCandidate({
                candidateId: candidateCounter++,
                coffeeName: _coffeeName,
                imageUrl: _imageUrl,
                description: _description,
                coffeeOrigin: _coffeeOrigin,
                beanType: _beanType,
                roastLevel: _roastLevel,
                voteCount: 0
        }));
        emit CoffeeCandidateAdded(_coffeeName, _imageUrl, _description, _coffeeOrigin, _beanType, _roastLevel);
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

    // This function is used to get the winner of the voting
    function getWinner() public view returns (CoffeeVoteCandidate memory) {
        require(!isOpenToVote(), "Voting is still open.");
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        for (uint256 i = 0; i < coffee_vote_candidates.length; i++) {
            if (coffee_vote_candidates[i].voteCount > maxVotes) {
                maxVotes = coffee_vote_candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return coffee_vote_candidates[winnerIndex];
    }
}