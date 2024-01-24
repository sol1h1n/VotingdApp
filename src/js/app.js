App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load Votings.
    $.getJSON('../Votings.json', function(data) {
      var VotingsRow = $('#VotingsRow');
      var VotingsTemplate = $('#VotingsTemplate');

      for (i = 0; i < data.length; i ++) {
        VotingsTemplate.find('.panel-title').text(data[i].name);
        VotingsTemplate.find('img').attr('src', data[i].picture);
        VotingsTemplate.find('.Votings-breed').text(data[i].breed);
        VotingsTemplate.find('.Votings-age').text(data[i].age);
        VotingsTemplate.find('.Votings-location').text(data[i].location);
        VotingsTemplate.find('.btn-vote').attr('data-id', data[i].id);

        VotingsRow.append(VotingsTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Voting.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var VotingArtifact = data;
      App.contracts.Voting = TruffleContract(VotingArtifact);
    
      // Set the provider for our contract
      App.contracts.Voting.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the voted Votings
      return App.markVoted();
    });
    

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
  },

  markVoted: function() {
    var VotingInstance;
  
    App.contracts.Voting.deployed().then(function(instance) {
      VotingInstance = instance;
  
      // Get vote counts only
      return VotingInstance.getVoteCounts.call();
    }).then(function(voteCounts) {
      for (i = 0; i < voteCounts.length; i++) {
        // Check if voteCount[i] is defined before accessing it
        var voteCount = (typeof voteCounts[i] !== 'undefined') ? voteCounts[i].toNumber() : 0;
  
        // Update vote count for each candidate
        $('.panel-Votings').eq(i).find('.vote-count').text('Votes: ' + voteCount);
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  

// New function to display total vote count for a candidate
displayVoteCount: function(VotingsId) {
  var VotingInstance;

  App.contracts.Voting.deployed().then(function(instance) {
      VotingInstance = instance;

      // Call getVoteCount to retrieve the total vote count for the candidate
      return VotingInstance.getVoteCount.call(VotingsId);
  }).then(function(voteCount) {
      // Display the vote count for the candidate
      $('.panel-Votings').eq(VotingsId).find('.vote-count').text('Vote Count: ' + voteCount);
  }).catch(function(err) {
      console.log(err.message);
  });
},

handleVote: function(event) {
  event.preventDefault();

  var VotingsId = parseInt($(event.target).data('id'));

  var VotingInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }

    var account = accounts[0];

    App.contracts.Voting.deployed().then(function(instance) {
      VotingInstance = instance;

      // Execute Vote as a transaction by sending account
      return VotingInstance.vote(VotingsId, { from: account });
    }).then(function(result) {
      console.log("Vote successful. Updating vote count...");
      App.markVoted(); // Call markVoted after the vote is executed
    }).catch(function(err) {
      console.error(err.message);
    });
  });
}


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
