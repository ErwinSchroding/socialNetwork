// SPDX-License-Identifier: GPL-3.0
// 数据层智能合约
// 此层提供数据check，但不需要实现检测逻辑。检测逻辑在service层通过调用本层的check函数实现。数据输入的检测由js前端提供。
// 请注意accounts转化，一般命名_account的变量接受account，也就是转换后的用户账户。_address变量接受address地址，也就是钱包地址
// 大部分函数均提供了参数变量为account和address的两种实现方式，因为msg.sender都是address，而前端传来的大多为account，
// 本层函数的参数也应尽可能为account，只有需要存储/使用address的情况下，才直接传递adderss，因为account无法转换到address
// 函数大多以set和check开头，提供数据的存储与验证。

// 原则上 一个函数只应处理一个mapping结构，业务实现后会对超出原则的编码进行优化

pragma solidity >=0.7.0 <0.9.0;

contract DataContract {
    mapping(address => address) private accounts; //将用户的公钥映射为一个新的地址，保护用户隐私安全。
    struct User {
        string name; // 用户名
        string email; // 电子邮件地址
        uint256 age; // 年龄
        address wallet; // 以太坊钱包地址，实际上就是address
        bool isVerified; // 是否已完善用户信息
        bool isDisabled; //账户是否被停用
    }
    mapping(address => User) private users; //存储account的信息,account => User

    struct Friend {
        //用于存储两个用户的朋友关系信息，如是否朋友，朋友时间等。
        bool exists; //是否存在过好友关系
        uint256 addedAt; //好友建立的时间
        string message; //好友申请信息
        bool deleted; //是否删除好友
    }
    mapping(address => mapping(address => Friend)) private friends; //记录没两个用户是否为朋友关系,以及两个人的朋友信息
    mapping(address => address[]) private myFriends; //记录某个用户的所有朋友地址
    mapping(address => address[]) private myFriendRequests; //记录某个用户收到的好友申请

    struct Article {
        string title; //标题
        string article; //内容
        uint256 timestamp; //时间
        // address[]  likesAccounts; //点赞用户
        // mapping(address => string)[] comments; //用户留言
        bool isDisplay; //是否展示
    }

    mapping(address => Article[]) articles; //记录每个用户的帖子
    // mapping(address => mapping(string[] => address)) articles
    // 在您的 Solidity 合约中，mapping(address => mapping(string[] => address)) articles 这个数据结构并不是有效的结构，因为 string[] 类型无法作为映射的键，只有以下数据类型可以作为映射的键：
    // 所有整型类型（不包括 Bytes32）
    // Address
    // Enum
    // String, 不超过 32 字节
    // Bytes，不超过 32 字节

    // 定义一个结构体，用于存储聊天信息
    struct Message {
        address sender; // 发送者地址account
        string content; // 聊天内容
        uint256 timestamp; // 时间戳
    }

    // 定义一个映射，用于存储聊天记录,两个都是account。前者为发送方，后者为接收方
    mapping(address => mapping(address => Message[])) private messages;
    
    // 两个都是account，存储某个账户接收到哪些账户的信息。
    mapping(address => address[]) private msgaccounts;


    struct CentralizedTweets {
        bytes32 tweetHash; //用户某内容的Hash值
        uint256 timestamp; // 时间戳
    }

    mapping(address => CentralizedTweets[]) private tweetsHashRecords; //记录某account某次发布中心化内容的hash值

    struct CentralizedMessage {
        bytes32 MessageHash; //用户间中心化服务器对话内容的Hash值
        uint256 timestamp; // 计算hash并存储的时间戳
    }

    mapping(address => mapping(address => CentralizedMessage[])) private messageHashRecords; //记录account间聊天内容的hash值

    //限制器，限制函数只允许部署者调用
    address private admin;

    constructor() {
        admin = msg.sender;
    }

    event OnlyAdminError(address sender, address admin);
    modifier onlyAdmin() {
        if (msg.sender != admin) {
            emit OnlyAdminError(msg.sender, admin);
            revert("DataContract: Only admin can call this function");
        }
        _;
    }

    function setAccounts(address _userAddress, address _userAccount) internal {
        accounts[_userAddress] = _userAccount;
    }

    function getAccounts(address _userAddress) internal view returns (address) {
        // require(
        //     accounts[msg.sender] != address(0),
        //     "MSG from DataContract-getAccounts : Address not found in accounts"
        // );
        //此校验应该在service中已经完成，故注释
        address result = accounts[_userAddress];
        return result;
    }

    //检测用户是否在accounts中有信息,传入address而不是account
    function checkAddressJoined(address _address) internal view returns (bool) {
        if (accounts[_address] != address(0)) {
            return true; //注册过，返回true
        } else {
            return false; //地址未注册过，返回false
        }
    }

    //检测某地址是否完善了用户信息User,传入address
    function checkAddressRegisted(address _address)
        internal
        view
        returns (bool)
    {
        address _account = accounts[_address];
        if (
            users[_account].wallet != address(0) ||
            users[_account].isVerified == true
        ) {
            return true; //信息填写过，返回true
        } else {
            return false; //信息未填写，返回false
        }
    }

    //检测用户是否完善了用户信息User,传入的应该是account
    function checkAccountRegisted(address _account)
        internal
        view
        returns (bool)
    {
        if (
            users[_account].wallet != address(0) ||
            users[_account].isVerified == true
        ) {
            return true; //信息填写过，返回true
        } else {
            return false; //信息未填写，返回false
        }
    }

    //检测用户addresss与某account是否为好友
    function checkAddressAndAccountIsFriend(
        address _sender,
        address _friendAccount
    ) internal view returns (bool) {
        address _account = accounts[_sender];
        if (friends[_account][_friendAccount].exists == true) {
            return true; //两个用户是好友，返回ture
        } else {
            return false; //两个用户不是好友，返回false
        }
    }

    //检测两个account是否为双向好友
    function checkAccountAndAccountIsFriend(
        address _account,
        address _friendAccount
    ) internal view returns (bool) {
        if (friends[_account][_friendAccount].exists == true && friends[_friendAccount][_account].exists == true) {
            return true; //两个用户是双向好友，返回ture
        } else {
            return false; //两个用户不是好友，返回false
        }
    }

    //此函数需要设置wallet的值，故传递address
    function setUserByAddress(
        address _address,
        string memory name,
        string memory email,
        uint256 age
    ) internal {
        address _account = accounts[_address]; //使用虚拟address映射信息，不暴露公钥
        address _wallet = _address;
        User memory user = User(name, email, age, _wallet, true, false);
        users[_account] = user;
    }

    //修改账户的信息验证状态
    function setAccountVerified(address _account, bool verified) internal {
        users[_account].isVerified = verified;
    }

    //直接修改某地址的信息状态
    function setAddressVerified(address _address, bool verified) internal {
        address _account = accounts[_address];
        users[_account].isVerified = verified;
    }

    //函数接收账户地址，返回账户注册的User信息
    function getUser(address _account)
        internal
        view
        returns (User memory result)
    {
        result = users[_account];
    }

    //将address与某个account结为朋友,传入添加好友的信息。对方调用同样的函数才可以成为好友，否则只是单向好友。
    function setFriendByaddress(
        address _sender,
        address _friendAccount,
        string memory message
    ) internal {
        address _account = accounts[_sender]; //将address转换为 account 地址

        friends[_account][_friendAccount] = Friend({
            exists: true,
            addedAt: block.timestamp,
            message: message,
            deleted: false
        });
        myFriends[_account].push(_friendAccount);
        //此处只是单项添加好友，应对方接受后再次调用，即可双向。
    }

    //将myaccount和friendAccount结为朋友,传入添加好友的信息。对方调用同样的函数才可以成为好友，否则只是单向好友。
    function setFriend(
        address _myAccount,
        address _friendAccount,
        string memory message
    ) internal {
        address _account =_myAccount;

        friends[_account][_friendAccount] = Friend({
            exists: true,
            addedAt: block.timestamp,
            message: message,
            deleted: false
        });
        myFriends[_account].push(_friendAccount);
        //此处只是单项添加好友，应对方接受后再次调用，即可双向。
        myFriendRequests[_friendAccount].push(_account);
        //在对方的好友申请中添加的自己的账户地址
    }

    //传入账户地址，返回该地址收到的好友申请
    function getFriendRequests(address _account) internal view  returns (address[] memory ){
        return myFriendRequests[_account];
    }

    function getFriends(address _account) internal view  returns (address[] memory ){
        return myFriends[_account];
    }

    

    function setMessages(address _senderAccount,address _recipientAccount , string memory _content) internal {
        Message memory message = Message({
            sender:_senderAccount,
            content: _content,
            timestamp: block.timestamp
        });
        messages[_senderAccount][_recipientAccount].push(message);

        //判断用户是否第一次收到该发送者的信息，不是的话将信息添加到msgaccounts中
        for(uint i =0;i < msgaccounts[_recipientAccount].length; i++){
            if (msgaccounts[_recipientAccount][i] == _senderAccount) {
            return ;
            }
        }

        msgaccounts[_recipientAccount].push(_senderAccount);

    } 

    //传入我的账户（接收者）和发送者账户，返回两者的信息数组
    function getMessages(address _myAccount,address _senderAccount) internal view returns(Message[] memory ) {
        
        return messages[_senderAccount][_myAccount];

    } 

    //传入我的账户，返回给我发送过信息的所有账户
    function getMsgAccount(address _myAccount) internal view returns (address[] memory){
        
        return msgaccounts[_myAccount];
    }

    function setArticles(address _senderAccount,string memory _title, string memory _content) internal {
        Article memory article = Article({
            title:_title,
            article: _content,
            timestamp: block.timestamp,
          
            isDisplay: true
        });
        articles[_senderAccount].push(article);    

    } 

    function getArticles(address _account) internal view returns(Article[] memory){
        return articles[_account];

    }

    






}
