pragma solidity ^0.4.0;
contract medicalAccessControl{

    address public hospitalAdmin;

    struct user {
        address ethID;
        bool addPermission;
        bool viewRecords;
    }

    user[] public users;
    mapping (address=>uint256) public userLookup;




    function editAccessRights(address inputID, bool inputAccessControlPermission, bool inputViewPermission) private {
        uint256 id;

        if (userLookup[inputID] == 0 && users[0].ethID != 0){
            userLookup[inputID] = users.length;
            id = users.length++;
            users[id] = user({
                ethID: inputID,
                addPermission: inputAccessControlPermission,
                viewRecords: inputViewPermission
            });
        } else {
            id = userLookup[inputID];
            user targetUser=users[id];
            targetUser.ethID = inputID;
            targetUser.addPermission = inputAccessControlPermission;
            targetUser.viewRecords = inputViewPermission;
        }
    }


    function medicalAccessControl(){
        hospitalAdmin = msg.sender;

        //Add hospital admin (who creates the record) to initialize the contract with themselves holding admin rights
        userLookup[hospitalAdmin] = users.length;
        uint256 id = users.length++;
        users[id] = user({
            ethID: msg.sender,
            addPermission:true,
            viewRecords:true
        });

    }


    function hasAccessRight(address targetUser) public returns (bool){
        if (userLookup[targetUser]==0 && users[0].ethID == 0){
            return false;
        } else {return (users[userLookup[targetUser]].addPermission);}
    }

    function hasViewRight(address targetUser) public returns (bool){
        if (userLookup[targetUser]==0 && users[0].ethID == 0){
            return false;
        } else {return (users[userLookup[targetUser]].viewRecords);}
    }

    function modifyAccessRight(address targetUser, bool viewRight, bool editRight){

        //If msg.sender has access right allow them to make changes
        //Otherwise terminate request
        if( hasAccessRight(msg.sender)){
            editAccessRights(targetUser,viewRight,editRight);
        }
    }

}
