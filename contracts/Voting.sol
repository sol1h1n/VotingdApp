// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Voting {
    address[4] public Voters;
    mapping(address => bool) public hasVoted;
    mapping(uint => mapping(address => bool)) public hasVotedForCandidate;
    mapping(uint => uint) public voteCount;

    // Vote function
    function Vote(uint VotingsId) public returns (uint) {
        require(VotingsId >= 0 && VotingsId <= 3);
        require(!hasVoted[msg.sender], "You have already voted.");

        Voters[VotingsId] = msg.sender;
        hasVoted[msg.sender] = true;
        voteCount[VotingsId]++; // Increment the vote count for the selected candidate

        return VotingsId;
    }

    // Retrieving the Voters
    function getVoters() public view returns (address[4] memory) {
        return Voters;
    }

    // Retrieve the total vote count for a specific candidate
    function getVoteCounts() public view returns (uint[4] memory) {
        uint[4] memory counts;
        for (uint i = 0; i < 4; i++) {
            counts[i] = voteCount[i];
        }
        return counts;
    }
}
