// SPDX-License-Identifier: GPL-3.0
// 业务层智能合约，用于操作数据层
// 数据校验在此进行，通过调用数据层的函数完成校验。
// 失败报错revert在此层发出，错误直接被react捕获并展示
// 此层的函数可能与data重名，故此层考虑在函数名前添加service标识，但暂未改变
import "../data/DataContract.sol";

pragma solidity >=0.7.0 <0.9.0;

contract ServiceContract is DataContract {
    // DataContract dataContract;

    // constructor(address _dataContractAddress){
    //     dataContract = DataContract(_dataContractAddress);
    // }

    //address _sender 由interface通过msg.sender传入，只有第一层可以使用msg.sender获取调用者信息。

    function join(address _sender) internal  returns (bool success) {
        success = false;
        if (checkAddressJoined(_sender)) {
            revert("ServiveContract-join: this address has joined");
        }
        address newAddress = address(
            uint160(
                uint256(
                    keccak256(abi.encodePacked(msg.sender, block.timestamp))
                )
            )
        ); // 生成新地址
        setAccounts(_sender, newAddress);
        success = true;

        // dataContract.setAccounts(msg.sender,newAddress);

        //emit joinEvent(1);
    }

    function getAccountByAddress(address _userAddress)
    internal
    view
    returns (address result)
    {

        if (!checkAddressJoined(_userAddress)) {
            revert(
            "ServiveContract-getAccountByAddress: The adderss you want to get account  hasn't joined"
            );
        }
        result = getAccounts(_userAddress);

    }

    function registerUser(
        address _sender,
        string memory name,
        string memory email,
        uint256 age
    ) internal {

        if (!checkAddressJoined(_sender)) {
            revert(
            "ServiveContract-registerUser: The adderss hasn't joined,Register failed"
            );
        }

        setUserByAddress(_sender, name, email, age);
        setAddressVerified(_sender,true);

    }

    function getProfileByAddress(address _sender)view  internal returns (User memory result){
        //此函数场景应该只有自己查询自己的账户信息。
        if (!checkAddressJoined(_sender)) {
            revert(
            "ServiveContract-getProfileByAddress: The adderss you want to get profile  hasn't joined"
            );
        }

        if(!checkAddressRegisted(_sender)){
            revert(
            "ServiveContract-getProfileByAddress: The address you want to get profile  hasn't registed"
            );
        }

        address _account = getAccounts(_sender);
        //通过验证后调用数据层转换地址为账户。

        result = getUser(_account);

    }

    function getProfileByAccount(address _account)view  internal  returns (User memory result){
        //调用查询其他用户账户的信息
        if(!checkAccountRegisted(_account)){
            revert(
            "ServiveContract-getProfileByAccount: The account you want to get profile hasn't registered"
            );
        }

        result = getUser(_account);

    }

    





    //根据account添加好友，接收address，和 account 并将两人设置为好友
    //根据尽量使用account的原则，该函数暂时未被使用，仅仅保留
    function addFriendByAddress(
        address _sender,
        address _friendAccount,
        string memory _message
    ) internal  {
        address _account = getAccounts(_sender);

        //只有完善了信息才可以添加好友。
        if (!checkAccountRegisted(_friendAccount)) {
            revert("ServiveContract-addFriend: Friend account not registered");
        }
        if (_friendAccount == _account) {
            revert(
            "ServiveContract-addFriend: Cannot add yourself as a friend"
            );
        }
        if (checkAccountAndAccountIsFriend(_account, _friendAccount)) {
            revert("ServiveContract-addFriend: He/She is already friends");
        }
        setFriendByaddress(_sender, _friendAccount, _message);
    }

    //根据account添加好友，接收两人的 account 并将两人设置为好友
    function addFriend(
        address _myAccount,
        address _friendAccount,
        string memory _message
    ) internal  {
        address _account = _myAccount;

        //只有完善了信息才可以添加好友。
        if (!checkAccountRegisted(_friendAccount)) {
            revert("ServiveContract-addFriend: Friend account not registered");
        }
        if (_friendAccount == _account) {
            revert(
            "ServiveContract-addFriend: Cannot add yourself as a friend"
            );
        }
        if (checkAccountAndAccountIsFriend(_account, _friendAccount)) {
            revert("ServiveContract-addFriend: He/She is already friend");
        }
        setFriend(_account, _friendAccount, _message);
    }

    //传入用户（自己）的Account，返回自己所有的朋友
    function getFriendsByAccount(address _account) internal view returns(address[] memory result)
    {
        result = getFriends(_account);
    }

    //传入用户（自己）的Account，返回自己所有好友申请
    function getFriendRequestsByAccount(address _account) internal view returns(address[] memory result)
    {
        result = getFriendRequests(_account);
    }

    //接收 发送者account，接收者account，发送内容
    function sendMessageByAccount(address _senderAccount,address _recipientAccount,string memory _content) internal {
        //检测是否双向好友
        if (!checkAccountAndAccountIsFriend( _senderAccount,_recipientAccount)) {
            revert("ServiveContract-sendMessage: Your friend request has not been approved");
        }
        setMessages(_senderAccount, _recipientAccount, _content);


    }

    //接收账户，返回给该账户发送信息的所有用户
    function getMsgAccountByAccount(address _myAccount) internal view returns(address[] memory result){
        result =  getMsgAccount(_myAccount);
    }

    //传入我的账户（接收者）和发送者账户，返回两者的信息数组
    function getMessagesByAccount(address _myAccount,address _senderAccount) internal view returns(Message[] memory ) {
        
       return getMessages(_myAccount, _senderAccount);

    } 

    //传入我的账户,标题和内容
    function sendArticlesByAccount(address _myAccount,string memory _title,string memory _content) internal {
        
       setArticles(_myAccount, _title,_content);

    } 


    //传入我的账户,返回发送过的article结构体数组
    function getArticlesByAccount(address _myAccount) internal view returns(Article[] memory ) {
        
       return getArticles(_myAccount);

    } 













}
