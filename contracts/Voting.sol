// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Voting {
    mapping(address => bool) public hasVoted; // Tracks whether an address has voted
    mapping(uint => uint) public voteCount;   // Tracks the number of votes for each candidate
    uint public constant NUM_CANDIDATES = 4;  // Total number of candidates

    event Voted(address indexed voter, uint indexed candidateId); // Event emitted after a vote

    // Function to cast a vote
    function vote(uint candidateId) public {
        require(candidateId < NUM_CANDIDATES, "Invalid candidate ID."); // Check for valid candidate
        require(!hasVoted[msg.sender], "You have already voted."); // Ensure the voter hasn't voted before

        hasVoted[msg.sender] = true; // Mark the voter as having voted
        voteCount[candidateId]++; // Increment the vote count for the candidate

        emit Voted(msg.sender, candidateId); // Emit the voting event
    }

    // Function to retrieve the total vote count for each candidate
    function getVoteCounts() public view returns (uint[NUM_CANDIDATES] memory counts) {
        for (uint i = 0; i < NUM_CANDIDATES; i++) {
            counts[i] = voteCount[i];
        }
    }
}
