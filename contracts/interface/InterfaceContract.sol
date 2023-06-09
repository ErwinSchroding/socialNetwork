// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// 接口层智能合约，用于调用逻辑层
// 成功事件在此层发出
// 有返回参数的接口触发事件，记录调用，但不在事件中包括返回的信息。返回信息通过return直接在返回中返回。

//事件命名 函数名+Event 参数 (string msg)
//由于服务层调用失败后执行的revert代码也会终止父函数，所以调用失败均不通过事件通知，也无法通过事件通知。
// msg 格式：EventMsg: Function 函数名 has just been called

//接口函数均采用显式Return返回。方便前端查看接口返回内容

// 在 Solidity 合约中，只有写入区块链的函数（即交易）才会触发事件。这是因为 Solidity 合约的事件是基于交易的，只有当交易被写入区块链后，事件才能被触发和记录。
// 如果你在 Solidity 合约中定义了一个只读函数（即不修改合约状态的函数），那么该函数不会触发事件。只读函数只是读取合约状态，并不会对区块链进行任何更改，因此不会触发事件。
// 因此本页面的部分不进行区块链写入的事件无法触发，但仍保留该事件的代码，以统一代码格式。

//请注意，对于没有交易产生的合约函数，msg.sender中是不可以获得地址的，因此请传递参数调用

//react可以使用account调用，故大部分通过ByAccount操作。ByAddress代码部分作废

//开发后期（如接受好友申请）大部分通过调用智能合约后的.then 输出调用成功信息，因为失败均会通过catch捕获。故后期event暂停在前端捕获

import "../service/ServiceContract.sol";

contract InterfaceContract is ServiceContract {

    //以下注释的内容以及被舍弃，并采取顶头注释的方式设计事件消息。

    // event interfaceJoinEvent(
    //     address indexed sender,
    //     int256 status,
    //     string message
    // ); //0-加入失败 1-加入成功 ,msssage - 事件消息

    // function interfaceJoin() public {
    //     if (join(msg.sender)) {
    //         emit interfaceJoinEvent(msg.sender, 1, "eventMsg: join succeed");
    //     } else {
    //         emit interfaceJoinEvent(msg.sender, 0, "eventMsg: join failed");
    //     }
    // }

    // event interfaceGetAccountByAddressEvent(
    //     address sender,
    //     address userAdderss,
    //     int256 status,
    //     string message
    // );

    // function interfaceGetAccountByAddress(address _userAddress)
    //     public
    //     returns (address)
    // {
    //     //revert 语句将会中止当前的函数执行，同时也会中止调用该函数的任何父函数的执行，所以其实success提供的判断逻辑和失败事件应该均不会被触发。
    //     //此处函数不再修改，后续也不再采取此种逻辑。
    //     (address result, bool success) = getAccountByAddress(_userAddress);
    //     if (success == false) {
    //         emit interfaceGetAccountByAddressEvent(
    //             msg.sender,
    //             _userAddress,
    //             0,
    //             "eventMsg: interfaceGetAccountByAddress failed"
    //         );

    //     }
    //     emit interfaceGetAccountByAddressEvent(
    //         msg.sender,
    //         _userAddress,
    //         1,
    //         "eventMsg: interfaceGetAccountByAddress succeeded"
    //     );
    //     return result;
    // }

    // function interfaceGetMyAccount() public returns (address) {
    //     (address result, bool success) = getAccountByAddress(msg.sender);
    //     // revert 语句将会中止当前的函数执行，同时也会中止调用该函数的任何父函数的执行，所以其实success提供的判断逻辑和失败事件应该均不会被触发。
    //     // 此处函数不再修改，后续也不再采取此种逻辑。
    //     if (success == false) {
    //         emit interfaceGetAccountByAddressEvent(
    //             msg.sender,
    //             msg.sender,
    //             0,
    //             "eventMsg: interfaceGetAccountByAddress failed"
    //         );

    //     }
    //     emit interfaceGetAccountByAddressEvent(
    //         msg.sender,
    //         msg.sender,
    //         1,
    //         "eventMsg: interfaceGetAccountByAddress succeeded"
    //     );
    //     return result;
    // }

    // event interfaceRegisterUserEvent(address _sender,string name);
    // function interfaceRegisterUser(
    //     string memory name,
    //     string memory email,
    //     uint256 age,
    //     address wallet
    //     // bool isVerified
    // ) public {
    //     if(registerUser(msg.sender, name, email, age, wallet)){
    //         emit interfaceRegisterUserEvent(msg.sender,name);
    //     }
    // }




    event interfaceJoinEvent(
        string msg
    );

    function interfaceJoin() public {
        //该接口调用场景唯一，用户通过metaMask注册/登录
        join(msg.sender);
        emit interfaceJoinEvent("Function interfaceJoin has been called");
    }


    event interfaceGetAccountByAddressEvent(
        string msg
    );

    function interfaceGetAccountByAddress(address _userAddress)
    public
    returns (address)
    {
        address result = getAccountByAddress(_userAddress);
        emit interfaceGetAccountByAddressEvent("Function interfaceGetAccountByAddress has been called");
        return result;
    }


    event interfaceGetMyAccountEvent(
        string msg
    );

    //该函数作废，请使用传参方式调用。因为没有交易生成，不会产生msg.sender变量，但在remix中可以正常调用。
    function interfaceGetMyAccount() public returns (address) {  
        address result = getAccountByAddress(msg.sender);

        emit interfaceGetMyAccountEvent("Function interfaceGetMyAccount has been called");
        return result;
    }



    event interfaceGetProfileByAccountEvent(
        string msg
    );

    function interfaceGetProfileByAccount(address _account) public returns (User memory) {

        User memory result =  getProfileByAccount(_account);
        emit interfaceGetProfileByAccountEvent("Function interfaceGetProfileByAccount has been called");
        return result;

    }


   

    function interfaceGetProfileByAddress(address _address) public returns (User memory) {

        User memory result =  getProfileByAddress(_address);
        emit interfaceGetProfileByAddressEvent("Function interfaceGetProfileByAddress has been called");
        return result;

    }

     event interfaceGetProfileByAddressEvent(
        string msg
    );

    

    event interfaceRegisterUserEvent(
        string msg
    );
    //传入name email age，自带msg.sender调用服务层函数
    function interfaceRegisterUser(
        string memory name,
        string memory email,
        uint256 age
    ) public {
        //接口唯一调用场景，本用户自己调用完善信息，传递本用户地址msg.sender
        registerUser(msg.sender, name, email,age);

        emit interfaceRegisterUserEvent("Function interfaceRegisterUser has been called");
    }


    event interfaceAddFriendEvent(
        string msg
    );

    function interfaceAddFriend(address _myAccount,address _friendAccount,string memory message) public {
        addFriend(_myAccount,_friendAccount,message);
        emit interfaceAddFriendEvent("Function interfaceAddFriend has been called");

    }

    //获取用户所有好友
    function interfaceGetFriendsByAccount(address _account) public  view returns(address[] memory result)
    {
        result = getFriendsByAccount(_account);
    }

    //获取用户所有好友申请
    function interfaceGetFriendRequestsByAccount(address _account) public  view returns(address[] memory result)
    {
        result = getFriendRequestsByAccount(_account);
    }




    event interfaceSendMessageByAccountEvent(
        string msg
    );

    function interfaceSendMessageByAccount(address _senderAccount,address _recipientAccount,string memory _content) public{
        sendMessageByAccount(_senderAccount, _recipientAccount, _content);
        emit interfaceSendMessageByAccountEvent("Function interfaceSendMessageByAccount has been called");

    }

    //获取给当前用户发送过消息的所有用户
    function interfaceGetMsgAccountByAccount(address _myAccount) public  view returns(address[] memory result){
        result =  getMsgAccountByAccount(_myAccount);
    }

    //获取二者消息
    function interfaceGetMessagesByAccount(address _myAccount,address _senderAccount) public  view returns(Message[] memory result){


        result = getMessagesByAccount(_myAccount, _senderAccount);
    }


     
    
    event interfaceSendArticlesByAccountEvent(
        string msg
    );

    function interfaceSendArticlesByAccount(address _senderAccount,string memory _title,string memory _content) public{
        sendArticlesByAccount(_senderAccount, _title, _content);
        emit interfaceSendArticlesByAccountEvent("Function interfaceSendArticlesByAccount has been called");

    }

    //获取给用户发送的文章
    function interfaceGetArticlesByAccount(address _account) public  view returns(Article[] memory result){
        result =  getArticlesByAccount(_account);
    }




























}
