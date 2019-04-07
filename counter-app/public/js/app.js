App = {
  web3Provider: null,
  counterInstance: null,
  url: 'http://127.0.0.1:9545',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    App.web3Provider = new Web3.providers.HttpProvider(App.url);
    web3 = new Web3(App.web3Provider);
    App.populateAddress(web3);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Counter.json', function(counterArtifact) {

      App.counterInstance = new web3.eth.Contract(counterArtifact.abi, contract_address);

      // Set default account to first account for now
      web3.eth.defaultAccount = web3.eth.accounts[0];

      return App.bindEvents();
    });
  },

  bindEvents: function() {
    $(document).on('click', '#increment', App.increment);
    $(document).on('click', '#decrement', App.decrement);
    $(document).on('click', '#init',App.initialize);
    App.getValue();
  },

  populateAddress : function(web3){
    web3.eth.getAccounts(function(err, accounts){
      $.each(accounts,function(i){
        if(i==0) {
         var optionElement = '<option value="'+accounts[i]+'" selected>'+accounts[i]+'</option>';
        } else {
         var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option>';
        }
         $('#eth-addresses').append(optionElement);  
      });
    });
  },

  getCurrentAccount: function() {
    return $("#eth-addresses option:selected").text();
  },

  getValue: function(){
    App.counterInstance.methods.get().call(function(err, result){
      $(".value").text(result);
   });
  },

  sendTransactionToNetwork: function(tx, privateKey){
    web3.eth.accounts.signTransaction(tx, privateKey, function(err, result){
      web3.eth.sendSignedTransaction(result.rawTransaction).on('receipt', function(receipt){
        if(receipt.status) {
          location.reload();
        }
      }).on('error', function(error){
        console.log(error);
      });
    });
  },

  increment: function(){
    
    var value = $('#numberInput').val();
    web3.eth.defaultAccount = App.getCurrentAccount();

    var privateKey = private_key;

    const fnc = App.counterInstance.methods.increment(value).encodeABI();

    const tx = {
      gas: 1000000,
      data: fnc,
      value: 0,
      to: contract_address
    }

    App.sendTransactionToNetwork(tx, privateKey);
  },

  decrement: function(){

    var value = $('#numberInput').val();
    web3.eth.defaultAccount = App.getCurrentAccount();

    var privateKey = private_key;

    const fnc = App.counterInstance.methods.decrement(value).encodeABI();

    const tx = {
      gas: 1000000,
      data: fnc,
      value: 0,
      to: contract_address
    }

    App.sendTransactionToNetwork(tx, privateKey);
  },

  initialize: function(){

    var value = $('#numberInput').val();
    web3.eth.defaultAccount = App.getCurrentAccount();

    var privateKey = private_key;

    const fnc = App.counterInstance.methods.initialize(value).encodeABI();

    const tx = {
      gas: 1000000,
      data: fnc,
      to: contract_address
    }

    App.sendTransactionToNetwork(tx, privateKey);
    
  } 
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
