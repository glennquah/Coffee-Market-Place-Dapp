pragma solidity ^0.8.0;

contract Leaderboard {
    address public orderContractAddress;
    uint256 public currentMonth;

    struct LeaderboardEntry {
        address customer;
        uint256 nftCount;
    }

    LeaderboardEntry[10] public topCustomers;
    mapping(address => uint256) nftCounts;

    event LeaderboardUpdated(address[] customers, uint256[] nftCounts);
    event RewardMinted(address customer, uint256 tokenId);
    event DebugLog(address customer, uint256 nftCount, uint256 iteration);

    modifier onlyOrder() {
        require(
            msg.sender == orderContractAddress,
            'Only the order contract can call this'
        );
        _;
    }

    constructor(address _orderContractAddress) {
        require(
            _orderContractAddress != address(0),
            'Invalid Order contract address'
        );
        orderContractAddress = _orderContractAddress;
        currentMonth = block.timestamp / 30 days;
    }

    // Function to update leaderboard upon new order creation
    function updateLeaderboard(
        address _customer,
        uint256 nftCount
    ) public onlyOrder {
        nftCounts[_customer] += nftCount;

        // Update the leaderboard if applicable
        for (uint256 i = 0; i < 10; i++) {
            if (topCustomers[i].customer == _customer) {
                topCustomers[i].nftCount = nftCounts[_customer];
                _bubbleSortLeaderboard();
                emit LeaderboardUpdated(
                    _getCustomerAddresses(),
                    _getNftCounts()
                );
                return;
            }
        }

        // If customer is not in the top leaderboard yet, check if they qualify
        if (nftCounts[_customer] > topCustomers[9].nftCount) {
            topCustomers[9] = LeaderboardEntry({
                customer: _customer,
                nftCount: nftCounts[_customer]
            });
            _bubbleSortLeaderboard();
            emit LeaderboardUpdated(_getCustomerAddresses(), _getNftCounts());
        }
    }

    // Function to reset the leaderboard at the end of the month
    function resetLeaderboard() public {
        uint256 month = block.timestamp / 30 days;
        require(
            month > currentMonth,
            'Leaderboard is up to date for this month'
        );

        // Reset leaderboard entries and nftCounts mapping
        for (uint256 i = 0; i < 10; i++) {
            address customer = topCustomers[i].customer;
            if (customer != address(0)) {
                nftCounts[customer] = 0;
            }
            topCustomers[i] = LeaderboardEntry({
                customer: address(0),
                nftCount: 0
            });
        }

        currentMonth = month;
    }

    // Helper function to perform a bubble sort on the leaderboard (top to bottom)
    function _bubbleSortLeaderboard() internal {
        for (uint256 i = 0; i < topCustomers.length; i++) {
            for (uint256 j = i + 1; j < topCustomers.length; j++) {
                if (topCustomers[i].nftCount < topCustomers[j].nftCount) {
                    LeaderboardEntry memory temp = topCustomers[i];
                    topCustomers[i] = topCustomers[j];
                    topCustomers[j] = temp;
                }
            }
        }
    }

    // Helper function to get customer addresses
    function _getCustomerAddresses() internal view returns (address[] memory) {
        address[] memory customerAddresses = new address[](10);
        for (uint256 i = 0; i < 10; i++) {
            customerAddresses[i] = topCustomers[i].customer;
        }
        return customerAddresses;
    }

    // Helper function to get NFT counts
    function _getNftCounts() internal view returns (uint256[] memory) {
        uint256[] memory nftCountsArray = new uint256[](10);
        for (uint256 i = 0; i < 10; i++) {
            nftCountsArray[i] = topCustomers[i].nftCount;
        }
        return nftCountsArray;
    }

    // Function to reward top customer(s)
    function rewardTopCustomer() public {
        // Reward the top customer(s) after leaderboard update
        require(topCustomers.length > 0, 'No top customers to reward');

        for (uint256 i = 0; i < topCustomers.length; i++) {
            if (topCustomers[i].customer != address(0)) {
                // ! Once NFT is ready, Mint reward NFT (integrate with the NFT minting function)
                // TODO: Reward logic here (e.g., minting and transferring a reward NFT);
            }
        }
    }

    function viewLeaderboard()
        public
        view
        returns (LeaderboardEntry[10] memory)
    {
        return topCustomers;
    }
}
