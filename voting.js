const Voting = artifacts.require("Voting");
const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("Voting", (accounts) => {
  let votingInstance;
  const [owner, voter1, voter2] = accounts;

  beforeEach(async () => {
    votingInstance = await Voting.new();
  });

  it("should allow a voter to cast a vote", async () => {
    const candidateId = 0;
    const { logs } = await votingInstance.vote(candidateId, { from: voter1 });

    expectEvent.inLogs(logs, "Voted", {
      voter: voter1,
      candidateId: new BN(candidateId),
    });

    // Additional assertions...
  });

  it("should prevent a voter from casting multiple votes", async () => {
    const candidateId1 = 0;
    const candidateId2 = 1;

    await votingInstance.vote(candidateId1, { from: voter2 });

    await expectRevert(
      votingInstance.vote(candidateId2, { from: voter2 }),
      "You have already voted."
    );
  });

 

  it("should have correct total vote count for each candidate after multiple votes", async () => {
    const candidateId = 0;
    const initialVoteCount = await votingInstance.getVoteCounts.call();

    // Vote multiple times
    await votingInstance.vote(candidateId, { from: voter1 });
    await votingInstance.vote(candidateId, { from: voter2 });

    const finalVoteCount = await votingInstance.getVoteCounts.call();

    expect(finalVoteCount[candidateId]).to.be.bignumber.equal(initialVoteCount[candidateId].add(new BN(2)));
  });
});
