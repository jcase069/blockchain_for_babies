var contractSource = 'contract babyContract {struct user {address ethID;bool addPermission;bool viewRecords; }  user[] public users; mapping (address=>uint) public userLookup;  function modifyUser(address inputID, bool inputAccessControlPermission, bool inputViewPermission){ uint id; if (userLookup[inputID] == 0){      userLookup[inputID] = users.length;  id = users.length++;  users[id] = user({  ethID: inputID,    addPermission: inputAccessControlPermission,  viewRecords: inputViewPermission  });} else { id = userLookup[inputID];  user targetUser=users[id];  targetUser.ethID = inputID;  targetUser.addPermission = inputAccessControlPermission;   targetUser.viewRecords = inputViewPermission;  } }}';


var contractCompiled = web3.eth.compile.solidity(contractSource);

var contractContract = web3.eth.contract(contractCompiled.babyContract.info.abiDefinition);

var babyContract = contractContract.new( {from: eth.accounts[0], data: contractCompiled.babyContract.code, gas: 4000000}, 
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        console.log("Contract transaction send: TransactionHash: " +
          contract.transactionHash + " waiting to be mined...");
      } else {
        console.log("Contract mined! Address: " + contract.address);
        console.log(contract);
      }
    } 
  }); 
