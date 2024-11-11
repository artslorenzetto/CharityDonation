// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    struct Cause {
        uint256 id;
        string name;
        string description; 
        uint256 totalDonations;
        address manager;
    }

    uint256 public causeCount;
    mapping(uint256 => Cause) public causes;
    mapping(address => mapping(uint256 => uint256)) public donations; // Track donations per address

    event DonationMade(address indexed donor, uint256 indexed causeId, uint256 amount);
    event DonationUpdated(uint256 causeId, uint256 totalDonations);
    event FundsWithdrawn(address indexed manager, uint256 amount);

    modifier onlyManager(uint256 causeId) {
        require(msg.sender == causes[causeId].manager, "Only the manager can withdraw funds");
        _;
    }

    constructor() {
        causeCount = 0;
    }

    // Create a new cause (charity project)
    function createCause(string memory name, string memory description, address manager) public {
        causeCount++;
        causes[causeCount] = Cause(causeCount, name, description, 0, manager);
    }

    // Donate to a specific cause (fictional units)
    function donate(uint256 causeId, uint256 amount) public {
        require(amount > 0, "Donation must be greater than 0");

        Cause storage cause = causes[causeId];
        cause.totalDonations += amount;
        donations[msg.sender][causeId] += amount;

        emit DonationMade(msg.sender, causeId, amount);
        emit DonationUpdated(causeId, cause.totalDonations); // Emit the updated total donations
    }

    // View the total donations for a specific cause
    function getCauseDonations(uint256 causeId) public view returns (uint256) {
        return causes[causeId].totalDonations;
    }

    // View donations by a specific donor
    function getDonorDonations(address donor, uint256 causeId) public view returns (uint256) {
        return donations[donor][causeId];
    }

    // Withdraw funds for a cause manager (fictional units)
    function withdrawFunds(uint256 causeId) public onlyManager(causeId) {
        uint256 amount = causes[causeId].totalDonations;
        require(amount > 0, "No funds available to wsithdraw");

        causes[causeId].totalDonations = 0;

        emit FundsWithdrawn(msg.sender, amount);
    }
}
